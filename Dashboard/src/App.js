import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom"; 

import Topbar from "./scenes/global/Topbar"
import Sidebar from "./scenes/global/Sidebar"
import Dashboard from "./scenes/dashboard"
import Team from "./scenes/team"
import Invoices from "./scenes/invoices"
import Contacts from "./scenes/contacts"
import Bar from "./scenes/bar"
import Form from "./scenes/form"
import Line from "./scenes/line"
import Pie from "./scenes/pie"
import FAQ from "./scenes/faq"
import Geography from "./scenes/geography"
import Calendar from "./scenes/calendar"
import Login from "./scenes/login";
import Signup from "./scenes/signup";
import { useAuthContext } from "./context/AuthContext";


function App() {
  const [theme, colorMode] = useMode()
  const {authUser, setAuthUser} = useAuthContext()  

  const handleLogout = () => {
    localStorage.removeItem("user-details")
    localStorage.removeItem("access-token")
    setAuthUser(null)
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {authUser ? <Sidebar /> : undefined}
          <main className="content">
            <Topbar logOut = {handleLogout} />
            <Routes>
              <Route path="/" element={authUser ? <Dashboard /> : <Navigate to='/login' />} />
              {/* <Route path="/login" element={authUser ? <Navigate to='/' /> : <Login auth = {handleLogin} />} /> */}
              <Route path="/login" element={authUser ? <Navigate to='/' /> : <Login />} />
              <Route path="/signup" element={authUser ? <Navigate to='/' /> : <Signup/>} />
              <Route path="/team" element={authUser ? <Team /> : <Navigate to='/login' /> } />
              <Route path="/invoices" element={authUser ? <Invoices /> : <Navigate to='/login' /> } />
              <Route path="/contacts" element={authUser ? <Contacts /> : <Navigate to='/login' /> } />
              <Route path="/bar" element={authUser ? <Bar /> : <Navigate to='/login' /> } />
              <Route path="/form" element={authUser ? <Form /> : <Navigate to='/login' /> } />
              <Route path="/line" element={authUser ? <Line /> : <Navigate to='/login' /> } />
              <Route path="/pie" element={authUser ? <Pie /> : <Navigate to='/login' /> } />
              <Route path="/faq" element={authUser ? <FAQ /> : <Navigate to='/login' /> } />
              <Route path="/geography" element={authUser ? <Geography /> : <Navigate to='/login' /> } />
              <Route path="/calendar" element={authUser ? <Calendar /> : <Navigate to='/login' /> } />
              <Route path="/*" element={<Navigate to='/' />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
