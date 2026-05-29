// components
import { Page } from "./components/PageLayout";

// pages
import Home from "./pages/Home";
import CreateNewEvent from "./pages/CreateNewEvent";
import EventDetail from "./pages/EventDetail";
import CreateNewQuiz from "./pages/CreateNewQuiz";
import EditQuiz from "./pages/EditQuiz";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

import { LiveEvent } from "./pages/Live/LiveEvent";

import AdminScreen from "./pages/Live/Admin/Admin";
import PlayerScreen from "./pages/Live/Player/Player";
import SpectatorScreen from "./pages/Live/Spectator/Spectator";

import Demo from "./pages/Demo";

// React Router Dom
import { HashRouter, Routes, Route } from "react-router-dom";
import { useUserAuth } from "./features/auth/hooks/useUserAuth";
import { Loading } from "./components/Loading";

const App = () => {
  const { isAuthLoading } = useUserAuth();

  if (isAuthLoading) return <Loading />;

  return (
    <Page>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-event" element={<CreateNewEvent />} />
          <Route path="/account" element={<Account />} />
          <Route path="/events/:eventId" element={<EventDetail />} />
          <Route
            path="/events/:eventId/create-quiz"
            element={<CreateNewQuiz />}
          />
          <Route
            path="/events/:eventId/quizzes/:quizId"
            element={<EditQuiz />}
          />
          <Route path="/events/:eventId/live" element={<LiveEvent />}>
            <Route path="admin" element={<AdminScreen />} />
            <Route path="player" element={<PlayerScreen />} />
            <Route path="spectator" element={<SpectatorScreen />} />
          </Route>
          <Route path="/demo" element={<Demo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </Page>
  );
};

export default App;
