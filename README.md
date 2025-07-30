
# PraktykanciHub - Centrum Zarządzania Praktykami

Witaj w **PraktykanciHub**! Jest to kompleksowa aplikacja społecznościowa stworzona, aby ułatwić organizację i komunikację podczas programu praktyk. Aplikacja łączy w sobie funkcje zarządzania obecnością, dzielenia się postępami zawodowymi oraz koordynowania wspólnych zamówień na lunch.

## Spis Treści

1.  [Kluczowe Funkcjonalności](#kluczowe-funkcjonalności)
    -   [Panel Główny](#panel-główny)
    -   [Rezerwacje Obecności](#rezerwacje-obecności)
    -   [Portfolio i Statusy Tygodniowe](#portfolio-i-statusy-tygodniowe)
    -   [Zamówienia Jedzenia i Głosowania](#zamówienia-jedzenia-i-głosowania)
    -   [Profile Użytkowników](#profile-użytkowników)
2.  [Technologie](#technologie)
3.  [Jak Zacząć](#jak-zacząć)

---

## Kluczowe Funkcjonalności

Aplikacja została zaprojektowana z myślą o czterech głównych filarach, które wspierają codzienne życie praktykantów, posiada różne systemy autoryzacji oraz oferuje możliwość użytkowania jako gość:

<img width="1901" height="893" alt="image" src="https://github.com/user-attachments/assets/3f5ac017-6723-4acf-b152-eeb5b9bc95aa" />

### Panel Główny

Po zalogowaniu użytkownik trafia na spersonalizowany panel główny, który jest centrum dowodzenia.

-   **Cotygodniowy monit o status:** W dni robocze (poniedziałek-piątek) na górze strony pojawia się prośba o uzupełnienie statusu tygodniowego.
-   **Kalendarz rezerwacji:** Główną część panelu zajmuje interaktywny kalendarz na bieżący tydzień, umożliwiający szybkie zarządzanie swoją obecnością.
-   
  <img width="1805" height="345" alt="image" src="https://github.com/user-attachments/assets/f49cf406-f87e-4d2e-a4c5-546ff0ac963f" />



### Rezerwacje Obecności

Moduł ten pozwala na łatwe planowanie pracy i sprawdzanie, kto z zespołu będzie danego dnia w biurze.

-   **Tygodniowy Widok Kalendarza:** Użytkownik widzi 5 dni roboczych (poniedziałek-piątek) z bieżącego tygodnia.
-   **Nawigacja:** Możliwość przełączania się między tygodniami oraz wyboru konkretnego miesiąca z listy, aby szybko przeskoczyć do odleglejszych dat.
-   **Rezerwacja Miejsca:**
    -   Użytkownik może zarezerwować swoje miejsce w **biurze** lub zadeklarować pracę **online**.
    -   Liczba miejsc w biurze jest ograniczona (domyślnie **12**). System uniemożliwia rezerwację, gdy limit jest osiągnięty.
-   **Anulowanie Rezerwacji:** W każdej chwili można cofnąć swoją rezerwację.
-   **Informacje o Obecności:**
    -   Na każdej karcie dnia widoczna jest liczba osób zapisanych do biura i online.
    -   Kliknięcie na listę pozwala zobaczyć awatary i imiona wszystkich zapisanych osób.
-   **Statusy Dni:** Karty dni są wizualnie oznaczone jako:
    -   **Dzisiaj:** Specjalna ramka podkreśla bieżący dzień.
    -   **Przeszłe/Niedostępne:** Dni, na które nie można już dokonywać rezerwacji, są wyszarzone.
 
    <img width="1900" height="888" alt="image" src="https://github.com/user-attachments/assets/ff144264-e13d-4d2f-b90e-22a11506de9b" />

### Portfolio i Statusy Tygodniowe

Każdy użytkownik posiada swój profil, na którym może budować portfolio swoich osiągnięć i dzielić się postępami.

-   **Statusy Tygodniowe:**
    -   Co tydzień aplikacja prosi o wypełnienie statusu, opisującego postępy i naukę.
    -   Status można zapisać jako **wersję roboczą** lub **opublikować od razu**.
    -   Opublikowane statusy stają się częścią publicznego portfolio użytkownika.
-   **Portfolio Projektów:**
    -   Użytkownicy mogą dodawać do swojego profilu projekty, nad którymi pracowali.
    -   Każdy projekt może zawierać **tytuł, opis, link** (np. do GitHuba lub działającej aplikacji) oraz listę użytych **technologii**.
-   **Zarządzanie Portfolio:** Z poziomu swojego profilu (w wysuwanym panelu) użytkownik może:
    -   Dodawać nowe projekty.
    -   Edytować i usuwać istniejące wpisy (zarówno statusy, jak i projekty).
    -   Przełączać widoczność każdego elementu, decydując, co jest widoczne dla innych.
 
      <img width="652" height="888" alt="image" src="https://github.com/user-attachments/assets/da0ab16d-535b-4e5a-8016-00b424542604" />

### Zamówienia Jedzenia i Głosowania

Moduł społecznościowy ułatwiający organizację wspólnych posiłków.

-   **Tworzenie Wydarzeń:** Użytkownik może utworzyć dwa rodzaje wydarzeń:
    1.  **Zamówienie Grupowe:** Zbieranie zamówień z jednej, konkretnej restauracji. Wymaga podania nazwy firmy, numeru telefonu do koordynacji i opcjonalnie linku do menu oraz terminu końcowego.
    2.  **Głosowanie na Restaurację:** Umożliwia społeczności demokratyczny wybór miejsca na lunch. Użytkownik definiuje tytuł głosowania i dodaje początkowe opcje (z nazwą i opcjonalnym linkiem).
       <img width="1890" height="892" alt="image" src="https://github.com/user-attachments/assets/5073478b-e314-4f6b-b11a-0f50e4def124" />

-   **Aktywne Wydarzenia vs Historia:** Interfejs jest podzielony na dwie zakładki:
    -   **Aktywne:** Bieżące, otwarte zamówienia i głosowania.
    -   **Historia:** Wszystkie zamknięte i zakończone wydarzenia.
 
      <img width="1370" height="858" alt="image" src="https://github.com/user-attachments/assets/2ca6a22d-3806-4b1d-b211-8cfd2b1dabfe" />

-   **Funkcjonalności Zamówień:**
    -   **Dodawanie do Zamówienia:** Użytkownicy mogą dodawać pozycje dla siebie lub dla **gościa** (podając jego imię).
    -   **Zarządzanie przez Twórcę/Admina:** Możliwość edycji, usuwania, zamykania i ponownego otwierania zamówienia oraz oznaczania wszystkich pozycji jako opłacone.
    -   **Śledzenie Płatności:** Twórca może oznaczać poszczególne zamówienia jako opłacone.
 
      <img width="1390" height="866" alt="image" src="https://github.com/user-attachments/assets/dbfa6aeb-d3a8-40fe-a661-6dec42a96f2d" />

-   **Funkcjonalności Głosowań:**
    -   **Głosowanie:** Użytkownicy mogą oddać jeden głos na wybraną opcję lub go cofnąć.
    -   **Dodawanie Propozycji:** Każdy może dodać własną propozycję restauracji w trakcie trwania głosowania.
    -   **Wyniki:** Po zakończeniu głosowania (ręcznie przez twórcę lub po upłynięciu terminu) opcja z największą liczbą głosów jest oznaczona jako zwycięzca.
    -   **Tworzenie Zamówienia z Głosowania:** Na podstawie zwycięskiej opcji można jednym kliknięciem utworzyć nowe zamówienie grupowe.
 
      <img width="1159" height="842" alt="image" src="https://github.com/user-attachments/assets/bb59666a-629e-4ff4-9b59-67253a7b358b" />


### Profile Użytkowników


Centralne miejsce, w którym można dowiedzieć się więcej o innych praktykantach.

-   **Lista Użytkowników:** Dostępna jest strona z kartami wszystkich uczestników programu.

    <img width="1887" height="877" alt="image" src="https://github.com/user-attachments/assets/6d421724-26b4-440c-b763-f1d788cd4a6d" />

-   **Publiczny Profil:** Kliknięcie na kartę przenosi do publicznego profilu, który zawiera:
    -   Imię, awatar i rolę (np. admin).
    -   Statystyki obecności (dni w biurze, dni online).
    -   Publicznie widoczne portfolio projektów i statusów tygodniowych.
 
      <img width="1390" height="900" alt="image" src="https://github.com/user-attachments/assets/05f4a384-bb26-4da1-a7cd-adf5220e77c3" />


---

## Technologie

PraktykanciHub został zbudowany przy użyciu nowoczesnych technologii webowych:

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Język:** [TypeScript](https://www.typescriptlang.org/)
-   **Biblioteka UI:** [React](https://reactjs.org/)
-   **Backend i Baza Danych:** [Firebase](https://firebase.google.com/) (Authentication, Firestore)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Komponenty UI:** [Shadcn/ui](https://ui.shadcn.com/)
-   **Animacje:** [Framer Motion](https://www.framer.com/motion/)

---

## Jak Zacząć

Aby uruchomić aplikację lokalnie, postępuj zgodnie z poniższymi krokami:

1.  **Zainstaluj zależności:**
    ```bash
    npm install
    ```
2.  **Uruchom serwer deweloperski:**
    ```bash
    npm run dev
    ```
3.  Otwórz [http://localhost:9002](http://localhost:9002) w swojej przeglądarce, aby zobaczyć aplikację.
