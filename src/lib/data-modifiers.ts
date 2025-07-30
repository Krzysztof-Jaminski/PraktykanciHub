
import { collection, doc, getDocs, writeBatch, Timestamp, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { PortfolioItem, Reservation, User } from './types';
import { addDays, startOfWeek } from 'date-fns';

// Helper function to get all users from Firestore
const getAllUsers = async (): Promise<User[]> => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    return usersSnapshot.docs.map(doc => doc.data() as User);
};


// --- Data for Modification ---

// 1. Reservation data
const reservationDate = "2025-07-28";
const officeUsersNames = ["Adam Kretowicz", "Pawel Krok", "Tomek Organisciak"];
const onlineUsersNames = [
    "Michal Kochmanski", "Mikolaj Zlotek", "Krzysztof Jaminski", "Dawid Klimkiewicz",
    "Dawid Jopek", "Krystian Nawojski", "Lukasz Ligezka", "Gabriela Wanat",
    "Szymon Boratyn", "Wojciech Jurasz", "Eryk Kunasz"
];

const newStatuses = [
    { name: "Adam Kretowicz", content: "W tym tygodniu zainteresowalem sie wzorcami projektowymi, przeczytalem jednominutowego managera. W tle gdzies robilem kurs z React, poznajac kolejne funkcjonalnosci. W drugiej polowie tygodnia skupilem sie na vibe-codowaniu. Utworzylem prosta strone portfolio, zrobilem tez rezerwacje miejsc ale dziala tylko lokalnie, poleglem na vibe-debugowaniu polaczenia z supabase, ale jeszcze do tego wroce i poprawie. Wrzucę linki na showcase dzis lub jutro." },
    { name: "Norbert Baj", content: "W tym tygodniu glownie zajmowalem sie dwoma aplikacjami przy pomocy vibecodingu pierwsza to prosta aplikacja z portfolio któa jest skonczona druga to Chatbot ktory mial pelnic funckje Dungeon mastera w grach rpg generalnie rozpoznaje on juz karty postaci graczy i generuje fabule ale jeszcze nie radzi sobie z systemem walki i balansowaniem wrogow. Nie idzie mu tez dobrze reagowanie co robia gracze w danym momencie raczej stara sie za wszelka cene podazac za fabula ktora wczesniej wymyslil a jak juz robi cos nowego to czesto nie ma to sensu i gubi sie w akcjach ale mam zamiar go dalej rozwijac w tym tygodniu." },
    { name: "Patryk Szumski", content: "W tym tygodniu udalo mi sie zrobic podstawowa aplikacje w SWIFT ktora mam zamiar poszerzyc o firebase oraz dodatkowe funkcje. W nadchodzacym tygodniu chce glownie skupic sie na ulepszaniu tej aplikacji" },
];

const newProjects = [
    { name: "Patryk Szumski", title: "OfficeFlow", description: "Apka do rezerwacji miejsc w biurze oraz wysylanie statusow, takze admin moze publikowac posty organizacyjne.", link: "https://studio--officeflow-q45tp.us-central1.hosted.app/login", technologies: ["Firebase Studio", "Next.js", "React"] },
    { name: "Tomek Organisciak", title: "Lunchroom", description: "Usprawnij codzienne zamowienia jedzenia w Twojej firmie.", link: "https://studio--lunchroom-ka1m2.us-central1.hosted.app/", technologies: ["Firebase Studio", "Next.js", "React"] },
    { name: "Dawid Jopek", title: "mLab Community", description: "Connect, collaborate, and grow with fellow developers in the mLab Community.", link: "https://studio--mlab-community.us-central1.hosted.app/", technologies: ["Firebase Studio", "Next.js", "React"] },
];


// --- Main Function ---

export const applyDataModifications = async () => {
    const allUsers = await getAllUsers();
    const batch = writeBatch(db);

    // 1. Update Reservation
    const officeUserIds = allUsers.filter(u => officeUsersNames.includes(u.name)).map(u => u.id);
    const onlineUserIds = allUsers.filter(u => onlineUsersNames.includes(u.name)).map(u => u.id);
    
    const reservationRef = doc(db, "reservations", reservationDate);
    const reservationData: Reservation = {
        date: reservationDate,
        office: officeUserIds,
        online: onlineUserIds
    };
    batch.set(reservationRef, reservationData, { merge: true });


    // 2. Add New Statuses
    newStatuses.forEach(statusData => {
        const user = allUsers.find(u => u.name === statusData.name);
        if (user) {
            const statusId = `status-mod-${user.id}`;
            const statusRef = doc(db, "portfolios", statusId);
            const portfolioItem: PortfolioItem = {
                id: statusId,
                userId: user.id,
                type: 'status',
                title: `Status - Modyfikacja`,
                description: statusData.content,
                date: new Date(),
                weekOf: startOfWeek(new Date(), { weekStartsOn: 1 }),
                isVisible: true
            };
            batch.set(statusRef, portfolioItem);
        }
    });

    // 3. Add New Projects
    newProjects.forEach(projectData => {
        const user = allUsers.find(u => u.name === projectData.name);
        if (user) {
            const projectId = `project-mod-${user.id}-${projectData.title.replace(/\s+/g, '-')}`;
            const projectRef = doc(db, "portfolios", projectId);
            const portfolioItem: PortfolioItem = {
                id: projectId,
                userId: user.id,
                type: 'project',
                title: projectData.title,
                description: projectData.description,
                link: projectData.link,
                date: new Date(),
                isVisible: true,
                technologies: projectData.technologies
            };
            batch.set(projectRef, portfolioItem);
        }
    });

    // Commit all changes
    await batch.commit();
};
