
"use client";

import { createContext, useState, useEffect, type ReactNode, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, OAuthProvider, signOut, type User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot, collection, query, where, writeBatch, deleteDoc, serverTimestamp, Timestamp, runTransaction, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { type User, type Reservation, type WeeklyStatus, type PortfolioItem, type FoodOrder, type OrderItem, type OrderItemData, type VotingOption } from "@/lib/types";
import { format, startOfWeek, differenceInWeeks } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { MAX_SPOTS } from "@/lib/utils";


export type StoredOrderDetails = {
    link?: string;
    creatorPhoneNumber?: string;
};

type NewFoodOrderData = {
    companyName: string;
    description?: string;
    deadline?: string;
} & (
    | { type: 'order', link?: string, creatorPhoneNumber?: string }
    | { type: 'voting', votingOptions: { name: string, link?: string }[] }
);

type EditedVotingEventData = Omit<NewFoodOrderData, 'type'> & { type: 'voting' };

const GUEST_USER: User = {
    id: 'guest',
    name: 'Gość',
    email: 'guest@example.com',
    role: 'user',
    avatarUrl: '',
};

type AppContextType = {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  authLoading: boolean;
  login: (providerName: 'google' | 'microsoft') => void;
  loginAsGuest: () => void;
  logout: () => void;
  reservations: Reservation[];
  toggleReservation: (date: Date, type: 'office' | 'online') => void;
  weeklyStatus: WeeklyStatus | null;
  portfolio: PortfolioItem[];
  showStatusPrompt: boolean;
  updateWeeklyStatus: (content: string, status: 'draft' | 'published') => void;
  upsertPortfolioItem: (item: PortfolioItem) => void;
  removePortfolioItem: (itemId: string) => void;
  togglePortfolioItemVisibility: (itemId: string) => void;
  allUsers: User[];
  getUserById: (userId: string) => User | null;
  foodOrders: FoodOrder[];
  addFoodOrder: (order: NewFoodOrderData) => void;
  editFoodOrder: (orderId: string, editedData: Omit<FoodOrder, 'id' | 'creatorId' | 'orders' | 'isOpen' | 'type' | 'votingOptions'> & { type: 'order' }) => void;
  editVotingEvent: (eventId: string, editedData: EditedVotingEventData) => void;
  removeFoodOrder: (orderId: string) => void;
  addOrderItem: (orderId: string, item: OrderItemData, guestName?: string) => void;
  removeOrderItem: (orderId: string, itemId: string) => void;
  togglePaidStatus: (orderId: string, itemId: string | 'all') => void;
  toggleOrderState: (orderId: string) => void;
  toggleVote: (eventId: string, optionId: string) => void;
  addVotingOption: (eventId: string, optionData: { name: string, link?: string }) => void;
  createOrderFromVote: (eventId: string, optionId: string) => void;
  storedOrderDetails: StoredOrderDetails | null;
};

export const AppContext = createContext<AppContextType>({
  user: null,
  firebaseUser: null,
  authLoading: true,
  login: () => {},
  loginAsGuest: () => {},
  logout: () => {},
  reservations: [],
  toggleReservation: () => {},
  weeklyStatus: null,
  portfolio: [],
  showStatusPrompt: false,
  updateWeeklyStatus: () => {},
  upsertPortfolioItem: () => {},
  removePortfolioItem: () => {},
  togglePortfolioItemVisibility: () => {},
  allUsers: [],
  getUserById: () => null,
  foodOrders: [],
  addFoodOrder: () => {},
  editFoodOrder: () => {},
  editVotingEvent: () => {},
  removeFoodOrder: () => {},
  addOrderItem: () => {},
  removeOrderItem: () => {},
  togglePaidStatus: () => {},
  toggleOrderState: () => {},
  toggleVote: () => {},
  addVotingOption: () => {},
  createOrderFromVote: () => {},
  storedOrderDetails: null,
});

const INTERNSHIP_START_DATE = new Date('2025-07-07');

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [foodOrders, setFoodOrders] = useState<FoodOrder[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  
  const [weeklyStatus, setWeeklyStatus] = useState<WeeklyStatus | null>(null);
  const [showStatusPrompt, setShowStatusPrompt] = useState(false);
  const [storedOrderDetails, setStoredOrderDetails] = useState<StoredOrderDetails | null>(null);
  
  const resetUserState = useCallback(() => {
    setUser(null);
    setFirebaseUser(null);
    setPortfolio([]);
    setWeeklyStatus(null);
    setShowStatusPrompt(false);
  }, []);

  // Auth state and user data listener
  useEffect(() => {
    let userDocUnsubscribe: (() => void) | undefined;
    let portfolioUnsubscribe: (() => void) | undefined;

    const authUnsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (userDocUnsubscribe) userDocUnsubscribe();
        if (portfolioUnsubscribe) portfolioUnsubscribe();
        
        if (fbUser) {
            setFirebaseUser(fbUser);
            const userRef = doc(db, "users", fbUser.uid);
            
            userDocUnsubscribe = onSnapshot(userRef, async (userSnap) => {
                if (userSnap.exists()) {
                    setUser(userSnap.data() as User);
                } else {
                    const newUser: User = {
                        id: fbUser.uid,
                        name: fbUser.displayName || "Nowy Użytkownik",
                        email: fbUser.email || "",
                        role: "user",
                        avatarUrl: fbUser.photoURL || "",
                    };
                    await setDoc(userRef, newUser);
                    setUser(newUser);
                }
                 setAuthLoading(false);
            });

            const portfolioQuery = query(collection(db, "portfolios"), where("userId", "==", fbUser.uid));
            portfolioUnsubscribe = onSnapshot(portfolioQuery, (snapshot) => {
                const userPortfolio = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        ...data,
                        id: doc.id,
                        date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
                        weekOf: data.weekOf instanceof Timestamp ? data.weekOf.toDate().toISOString() : data.weekOf,
                    } as PortfolioItem;
                }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setPortfolio(userPortfolio);
            });

        } else {
            // If there's no Firebase user, and we are not a guest, it means we are truly logged out.
            if (user?.id !== 'guest') {
                resetUserState();
            }
            setAuthLoading(false);
        }
    });

    return () => {
        authUnsubscribe();
        if (userDocUnsubscribe) userDocUnsubscribe();
        if (portfolioUnsubscribe) portfolioUnsubscribe();
    };
  }, [resetUserState]);

  // Global data listeners (for all users, including guests)
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setAllUsers(snapshot.docs.map(doc => doc.data() as User));
    });

    const unsubReservations = onSnapshot(collection(db, "reservations"), (snapshot) => {
      setReservations(snapshot.docs.map(doc => doc.data() as Reservation));
    });

    const unsubFoodOrders = onSnapshot(query(collection(db, "foodOrders")), (snapshot) => {
        const orders = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                deadline: data.deadline instanceof Timestamp ? data.deadline.toDate().toISOString() : undefined,
                createdAt: data.createdAt, 
            } as FoodOrder & { createdAt: Timestamp };
        }).sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setFoodOrders(orders);
    });

    return () => {
      unsubUsers();
      unsubReservations();
      unsubFoodOrders();
    };
  }, []);

  const login = async (providerName: 'google' | 'microsoft') => {
    let provider;
    if (providerName === 'google') {
        provider = new GoogleAuthProvider();
    } else {
        provider = new OAuthProvider('microsoft.com');
    }
    
    try {
      setAuthLoading(true);
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error) {
      console.error("Błąd logowania:", error);
      toast({ title: 'Błąd logowania', description: 'Nie udało się zalogować. Spróbuj ponownie.' });
      setAuthLoading(false);
    }
  };

    const loginAsGuest = useCallback(() => {
        resetUserState();
        setUser(GUEST_USER);
        setAuthLoading(false);
        router.push('/');
    }, [resetUserState, router]);
  
  const logout = useCallback(async () => {
    resetUserState();
    if (firebaseUser) {
        try {
          await signOut(auth);
        } catch (error) {
          console.error("Błąd wylogowywania:", error);
          toast({ title: 'Błąd wylogowywania' });
        }
    }
    router.push('/welcome');
  }, [firebaseUser, resetUserState, router]);

  const getUserById = (userId: string) => {
      if (userId === 'guest') return GUEST_USER;
      return allUsers.find(u => u.id === userId) || null;
  }
  
    const toggleReservation = async (date: Date, type: 'office' | 'online') => {
        if (!user || user.id === 'guest') {
            toast({ title: 'Funkcja niedostępna', description: 'Zaloguj się, aby zarządzać rezerwacjami.' });
            return;
        }

        const dateString = format(date, "yyyy-MM-dd");
        const reservationRef = doc(db, "reservations", dateString);
        const currentUserId = user.id;

        try {
            await runTransaction(db, async (transaction) => {
                const docSnap = await transaction.get(reservationRef);
                const data = docSnap.exists() ? docSnap.data() as Omit<Reservation, 'date'> : { office: [], online: [] };

                const isBookedOffice = data.office.includes(currentUserId);
                const isBookedOnline = data.online.includes(currentUserId);
                
                let updatedData = {
                    office: data.office.filter(id => id !== currentUserId),
                    online: data.online.filter(id => id !== currentUserId)
                };

                const isCanceling = (type === 'office' && isBookedOffice) || (type === 'online' && isBookedOnline);

                if (isCanceling) {
                    toast({ title: "Rezerwacja anulowana" });
                } else {
                    if (type === 'office' && updatedData.office.length >= MAX_SPOTS) {
                        toast({ title: "Brak miejsc w biurze!" });
                        // Throwing an error will abort the transaction
                        throw new Error("Office is full");
                    }
                    updatedData[type].push(currentUserId);
                    toast({ title: "Rezerwacja potwierdzona!" });
                }
                
                transaction.set(reservationRef, { date: dateString, ...updatedData }, { merge: true });
            });
        } catch (error: any) {
            if (error.message !== "Office is full") {
                console.error("Błąd rezerwacji:", error);
                toast({ title: 'Błąd rezerwacji' });
            }
        }
    };
    
    const upsertPortfolioItem = async (item: PortfolioItem) => {
        if (!user || user.id === 'guest') {
            toast({
                variant: 'destructive',
                title: 'Funkcja niedostępna',
                description: 'Zaloguj się, aby zarządzać swoim portfolio.'
            });
            return;
        }
        try {
            const portfolioRef = doc(db, "portfolios", item.id);
            await setDoc(portfolioRef, { ...item, userId: user.id }, { merge: true });
            toast({ title: "Portfolio zaktualizowane" });
        } catch (error) {
            console.error("Błąd zapisu portfolio:", error);
            toast({ title: 'Błąd zapisu' });
        }
    };

    const removePortfolioItem = async (itemId: string) => {
        if (!user || user.id === 'guest') return;
        try {
            await deleteDoc(doc(db, "portfolios", itemId));
            toast({ title: "Element usunięty" });
        } catch (error) {
            console.error("Błąd usuwania elementu portfolio:", error);
            toast({ title: 'Błąd usuwania' });
        }
    };

    const togglePortfolioItemVisibility = async (itemId: string) => {
        if (!user || user.id === 'guest') return;
        const item = portfolio.find(p => p.id === itemId);
        if (!item) return;
        try {
            const portfolioRef = doc(db, "portfolios", itemId);
            await setDoc(portfolioRef, { isVisible: !item.isVisible }, { merge: true });
        } catch (error) {
            console.error("Błąd zmiany widoczności:", error);
            toast({ title: 'Błąd' });
        }
    };
    
    const addFoodOrder = async (orderData: NewFoodOrderData) => {
        if (!user || user.id === 'guest') {
            toast({ title: 'Funkcja niedostępna', description: 'Zaloguj się, aby tworzyć wydarzenia.' });
            return;
        }
    
        const batch = writeBatch(db);
    
        if (orderData.type === 'voting') {
            const activeVotingEvents = foodOrders.filter(o => o.type === 'voting' && o.isOpen);
            activeVotingEvents.forEach(event => {
                const eventRef = doc(db, "foodOrders", event.id);
                batch.update(eventRef, { isOpen: false });
            });
        }
    
        let deadlineTimestamp: Timestamp | undefined;
        if (orderData.deadline) {
            const deadlineDate = new Date();
            const [hours, minutes] = orderData.deadline.split(':').map(Number);
            deadlineDate.setHours(hours, minutes, 0, 0);
            deadlineTimestamp = Timestamp.fromDate(deadlineDate);
        }
    
        const newEventRef = doc(collection(db, "foodOrders"));
        
        const eventPayload: any = {
            id: newEventRef.id,
            creatorId: user.id,
            companyName: orderData.companyName,
            isOpen: true,
            createdAt: serverTimestamp(),
            ...(orderData.description && { description: orderData.description }),
            ...(deadlineTimestamp && { deadline: deadlineTimestamp }),
        };
    
        if (orderData.type === 'voting') {
            eventPayload.type = 'voting';
            eventPayload.votingOptions = orderData.votingOptions.map((opt, index) => ({
                id: `${Date.now()}-${index}`,
                name: opt.name,
                ...(opt.link && { link: opt.link }),
                votes: [],
                addedById: user.id,
            }));
            eventPayload.orders = [];
        } else {
            eventPayload.type = 'order';
            eventPayload.orders = [];
            if (orderData.link) eventPayload.link = orderData.link;
            if (orderData.creatorPhoneNumber) eventPayload.creatorPhoneNumber = orderData.creatorPhoneNumber;
        }
    
        batch.set(newEventRef, eventPayload);
    
        try {
            await batch.commit();
            toast({ title: "Wydarzenie utworzone!" });
        } catch (error) {
            console.error("Błąd tworzenia wydarzenia:", error);
            toast({ title: 'Błąd', description: (error as Error).message });
        }
    };
  
    const editFoodOrder = async (orderId: string, editedData: Omit<FoodOrder, 'id' | 'creatorId' | 'orders' | 'isOpen' | 'type' | 'votingOptions'> & { type: 'order' }) => {
        if (!user || user.id === 'guest') return;
        try {
            const orderRef = doc(db, "foodOrders", orderId);
            
            const updatePayload: { [key: string]: any } = {};
    
            Object.keys(editedData).forEach(key => {
                const typedKey = key as keyof typeof editedData;
                const value = editedData[typedKey];
                if (value !== undefined) {
                    updatePayload[typedKey] = value;
                }
            });
            
            if (editedData.deadline && editedData.deadline.includes(':')) {
                const deadlineDate = new Date();
                const [hours, minutes] = editedData.deadline.split(':').map(Number);
                deadlineDate.setHours(hours, minutes, 0, 0);
                updatePayload.deadline = Timestamp.fromDate(deadlineDate);
            } else if (editedData.deadline === '') { 
                updatePayload.deadline = null;
            }
    
            await updateDoc(orderRef, updatePayload);
            toast({ title: "Zamówienie zaktualizowane." });
        } catch (error) {
            console.error("Błąd edycji zamówienia:", error);
            toast({ title: 'Błąd edycji zamówienia' });
        }
    };

    const editVotingEvent = async (eventId: string, editedData: EditedVotingEventData) => {
        if (!user || user.id === 'guest') return;
        const eventRef = doc(db, "foodOrders", eventId);
    
        try {
            await runTransaction(db, async (transaction) => {
                const eventDoc = await transaction.get(eventRef);
                if (!eventDoc.exists()) throw new Error("Głosowanie nie istnieje.");
    
                const currentData = eventDoc.data() as FoodOrder;
                const updatePayload: any = {
                    companyName: editedData.companyName,
                    description: editedData.description || '',
                };
    
                if (editedData.deadline && editedData.deadline.includes(':')) {
                    const deadlineDate = new Date();
                    const [hours, minutes] = editedData.deadline.split(':').map(Number);
                    deadlineDate.setHours(hours, minutes, 0, 0);
                    updatePayload.deadline = Timestamp.fromDate(deadlineDate);
                } else if (editedData.deadline === '') {
                    updatePayload.deadline = null;
                }
    
                // Preserve votes for existing options
                const newOptions = editedData.votingOptions.map((opt, index) => {
                    const existingOption = currentData.votingOptions?.find(
                        (eo) => eo.name === opt.name
                    );
                    return {
                        id: existingOption?.id || `${Date.now()}-${index}`,
                        name: opt.name,
                        link: opt.link || '',
                        votes: existingOption?.votes || [],
                        addedById: existingOption?.addedById || user.id,
                    };
                });
    
                updatePayload.votingOptions = newOptions;
    
                transaction.update(eventRef, updatePayload);
            });
            toast({ title: "Głosowanie zaktualizowane." });
        } catch (error) {
            console.error("Błąd edycji głosowania:", error);
            toast({ title: 'Błąd edycji głosowania' });
        }
    };
    
    const removeFoodOrder = async (orderId: string) => {
        if (!user || user.id === 'guest') return;
        try {
            await deleteDoc(doc(db, "foodOrders", orderId));
            toast({ title: "Wydarzenie usunięte." });
        } catch (error) {
            console.error("Błąd usuwania wydarzenia:", error);
            toast({ title: 'Błąd usuwania' });
        }
    };

    const addOrderItem = async (orderId: string, itemData: OrderItemData, guestName?: string) => {
        if (!user) return;
        
        const orderRef = doc(db, "foodOrders", orderId);

        try {
            await runTransaction(db, async (transaction) => {
                const orderDoc = await transaction.get(orderRef);
                if (!orderDoc.exists() || !orderDoc.data().isOpen) {
                    throw new Error("Zamówienie jest zamknięte lub nie istnieje.");
                }

                const newOrderItem: OrderItem = {
                    ...itemData,
                    id: `${Date.now()}-${user.id}`,
                    userId: guestName ? null : user.id,
                    isPaid: false,
                    ...(guestName && { guestName }),
                };
                
                transaction.update(orderRef, {
                    orders: [...orderDoc.data().orders, newOrderItem]
                });
            });
            toast({ title: "Dodano do zamówienia!" });
        } catch(error) {
            console.error("Błąd dodawania do zamówienia:", error);
            toast({ title: 'Błąd', description: (error as Error).message });
        }
    };

    const removeOrderItem = async (orderId: string, itemId: string) => {
        if (!user || user.id === 'guest') return;
    
        const orderRef = doc(db, "foodOrders", orderId);
        let wasRemoved = false;
    
        try {
            await runTransaction(db, async (transaction) => {
                const orderDoc = await transaction.get(orderRef);
                if (!orderDoc.exists()) throw new Error("Zamówienie nie istnieje.");
    
                const currentOrder = orderDoc.data() as FoodOrder;
                const isCreator = currentOrder.creatorId === user.id;
                const isAdmin = user.role === 'admin';
    
                const originalLength = currentOrder.orders.length;
                
                const updatedOrders = currentOrder.orders.filter(item => {
                    // This is the item to potentially remove
                    if (item.id === itemId) {
                        // Allow removal if user is creator, admin, or the owner of the item
                        if (isCreator || isAdmin || item.userId === user.id) {
                            return false; // Remove item
                        }
                    }
                    return true; // Keep item
                });
    
                if (updatedOrders.length < originalLength) {
                    wasRemoved = true;
                    transaction.update(orderRef, { orders: updatedOrders });
                }
            });
    
            if (wasRemoved) {
                toast({ title: "Pozycja usunięta." });
            } else {
                toast({ title: 'Brak uprawnień', description: 'Nie możesz usunąć tej pozycji.' });
            }
        } catch (error) {
            console.error("Błąd usuwania pozycji:", error);
            toast({ title: 'Błąd usuwania', description: (error as Error).message });
        }
    };
    
    const togglePaidStatus = async (orderId: string, itemId: string | 'all') => {
        if (!user || user.id === 'guest') return;

        const orderRef = doc(db, "foodOrders", orderId);
        try {
            await runTransaction(db, async (transaction) => {
                const orderDoc = await transaction.get(orderRef);
                if (!orderDoc.exists()) throw new Error("Zamówienie nie istnieje.");

                const currentOrders = orderDoc.data().orders as OrderItem[];
                
                if (itemId === 'all') {
                    const updatedOrders = currentOrders.map(item => ({ ...item, isPaid: true }));
                    transaction.update(orderRef, { orders: updatedOrders });
                } else {
                    const updatedOrders = currentOrders.map(item => 
                        item.id === itemId ? { ...item, isPaid: !item.isPaid } : item
                    );
                    transaction.update(orderRef, { orders: updatedOrders });
                }
            });
        } catch (error) {
            console.error("Błąd zmiany statusu płatności:", error);
            toast({ title: 'Błąd' });
        }
    };

    const toggleOrderState = async (orderId: string) => {
        if (!user || user.id === 'guest') return;
        
        const orderRef = doc(db, "foodOrders", orderId);
        const order = foodOrders.find(o => o.id === orderId);
        if (!order) return;
        
        const newState = !order.isOpen;

        // If we are re-opening a voting event, check if another one is already active
        if (newState === true && order.type === 'voting') {
            const anotherVoteIsActive = foodOrders.some(o => o.type === 'voting' && o.isOpen && o.id !== orderId);
            if (anotherVoteIsActive) {
                toast({ title: 'Aktywne głosowanie już istnieje!', description: 'Może być tylko jedno aktywne głosowanie na raz.' });
                return;
            }
        }

        try {
            await updateDoc(orderRef, { isOpen: newState });
            toast({ title: `Wydarzenie ${newState ? 'wznowione' : 'zakończone'}.` });
        } catch (error) {
            console.error("Błąd zmiany stanu wydarzenia:", error);
            toast({ title: 'Błąd' });
        }
    };

    const toggleVote = async (eventId: string, optionId: string) => {
        if (!user || user.id === 'guest') return;
        const userId = user.id;
        const eventRef = doc(db, "foodOrders", eventId);
    
        try {
            await runTransaction(db, async (transaction) => {
                const eventDoc = await transaction.get(eventRef);
                if (!eventDoc.exists() || !eventDoc.data().isOpen) {
                    throw new Error("Głosowanie jest zamknięte lub nie istnieje.");
                }
    
                const eventData = eventDoc.data() as FoodOrder;
                const options = eventData.votingOptions || [];
    
                const updatedOptions = options.map(opt => {
                    // This is the option we're toggling
                    if (opt.id === optionId) {
                        const currentVotes = opt.votes || [];
                        const hasVoted = currentVotes.includes(userId);
                        
                        if (hasVoted) {
                            // User has voted, so remove the vote
                            const newVotes = currentVotes.filter(v => v !== userId);
                            return { ...opt, votes: newVotes };
                        } else {
                            // User has not voted, so add the vote
                            return { ...opt, votes: [...currentVotes, userId] };
                        }
                    }
                    // For all other options, just return them as they are
                    return opt;
                });
    
                transaction.update(eventRef, { votingOptions: updatedOptions });
            });
        } catch (error) {
            console.error("Błąd głosowania:", error);
            toast({ title: 'Błąd głosowania', description: (error as Error).message });
        }
    };

    const addVotingOption = async (eventId: string, optionData: { name: string, link?: string }) => {
        if (!user || user.id === 'guest') return;
        const eventRef = doc(db, "foodOrders", eventId);

        try {
            await runTransaction(db, async (transaction) => {
                const eventDoc = await transaction.get(eventRef);
                if (!eventDoc.exists() || !eventDoc.data().isOpen) {
                    throw new Error("Głosowanie jest zamknięte lub nie istnieje.");
                }

                const newOption: VotingOption = {
                    id: `${Date.now()}-${user.id}`,
                    name: optionData.name,
                    link: optionData.link,
                    votes: [],
                    addedById: user.id
                };
                
                transaction.update(eventRef, {
                    votingOptions: [...(eventDoc.data().votingOptions || []), newOption]
                });
            });
            toast({ title: "Dodano nową opcję!" });
        } catch (error) {
            console.error("Błąd dodawania opcji:", error);
            toast({ title: 'Błąd', description: (error as Error).message });
        }
    };
    
    const createOrderFromVote = async (eventId: string, optionId: string) => {
        if (!user || user.id === 'guest') return;
        const eventRef = doc(db, "foodOrders", eventId);
        const newOrderRef = doc(collection(db, "foodOrders"));

        try {
            await runTransaction(db, async (transaction) => {
                const eventDoc = await transaction.get(eventRef);
                if (!eventDoc.exists()) throw new Error("Głosowanie nie istnieje.");
                
                const eventData = eventDoc.data() as FoodOrder;
                const winningOption = eventData.votingOptions?.find(opt => opt.id === optionId);

                if (!winningOption) throw new Error("Zwycięska opcja nie została znaleziona.");

                // Close the current voting event
                transaction.update(eventRef, { isOpen: false });

                // Create a new order event
                transaction.set(newOrderRef, {
                    id: newOrderRef.id,
                    creatorId: user.id,
                    companyName: winningOption.name,
                    link: winningOption.link,
                    isOpen: true,
                    type: 'order',
                    createdAt: serverTimestamp(),
                    orders: [],
                    creatorPhoneNumber: '', // You might want to prompt for this
                    description: `Utworzone z głosowania: "${eventData.companyName}"`,
                });
            });
            toast({ title: "Utworzono zamówienie!", description: `Możesz teraz zbierać zamówienia dla ${name}.` });
        } catch (error) {
            console.error("Błąd tworzenia zamówienia z głosowania:", error);
            toast({ title: 'Błąd', description: (error as Error).message });
        }
    };
    
    const updateWeeklyStatus = async (content: string, status: 'draft' | 'published') => {
        if (!user || user.id === 'guest') return;

        const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
        const weekNumber = differenceInWeeks(startOfThisWeek, startOfWeek(INTERNSHIP_START_DATE, { weekStartsOn: 1 })) + 1;
        const statusId = `week-${weekNumber}-${user.id}`;
        
        try {
            // This is a portfolio item as well
            const portfolioItem: PortfolioItem = {
                id: statusId,
                userId: user.id,
                type: 'status',
                title: `Status - Tydzień ${weekNumber}`,
                description: content,
                date: new Date().toISOString(),
                weekOf: startOfThisWeek.toISOString(),
                isVisible: status === 'published',
            };
            await upsertPortfolioItem(portfolioItem);
            
            if(status === 'published') {
                toast({ title: "Status opublikowany!", description: "Został dodany do Twojego portfolio." });
            } else {
                toast({ title: "Wersja robocza zapisana." });
            }

        } catch (error) {
             console.error("Błąd aktualizacji statusu:", error);
            toast({ title: 'Błąd' });
        }
    };

    // Weekly status logic
    useEffect(() => {
        if (!user || user.id === 'guest') {
            setShowStatusPrompt(false);
            setWeeklyStatus(null);
            return;
        }

        const today = new Date();
        const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1...
        
        // Show prompt from Monday to Friday
        const shouldShow = dayOfWeek >= 1 && dayOfWeek <= 5;
        setShowStatusPrompt(shouldShow);

        if (shouldShow) {
            const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
            const weekNumber = differenceInWeeks(startOfThisWeek, startOfWeek(INTERNSHIP_START_DATE, { weekStartsOn: 1 })) + 1;
            const statusId = `week-${weekNumber}-${user.id}`;
            
            const relevantPortfolioItem = portfolio.find(p => p.id === statusId && p.type === 'status');
            
            if (relevantPortfolioItem) {
                setWeeklyStatus({
                    week: weekNumber,
                    content: relevantPortfolioItem.description,
                    status: 'published' // If it exists in portfolio, it has been published at least once
                });
            } else {
                 setWeeklyStatus({
                    week: weekNumber,
                    content: '',
                    status: 'draft'
                });
            }
        }
    }, [user, portfolio]);
    
    useEffect(() => {
        if (user && user.id !== 'guest') {
             const userOrderDetails = foodOrders
                .filter(o => o.creatorId === user.id && o.type === 'order')
                .map(o => ({ link: o.link, creatorPhoneNumber: o.creatorPhoneNumber }))
                .pop(); // Get the latest one

            if (userOrderDetails) {
                setStoredOrderDetails(userOrderDetails);
            }
        }
    }, [foodOrders, user]);


  return (
    <AppContext.Provider
      value={{
        user,
        firebaseUser,
        authLoading,
        login,
        loginAsGuest,
        logout,
        reservations,
        toggleReservation,
        weeklyStatus,
        portfolio,
        showStatusPrompt,
        updateWeeklyStatus,
        upsertPortfolioItem,
        removePortfolioItem,
        togglePortfolioItemVisibility,
        allUsers,
        getUserById,
        foodOrders,
        addFoodOrder,
        editFoodOrder,
        editVotingEvent,
        removeFoodOrder,
        addOrderItem,
        removeOrderItem,
        togglePaidStatus,
        toggleOrderState,
        toggleVote,
        addVotingOption,
        createOrderFromVote,
        storedOrderDetails,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
