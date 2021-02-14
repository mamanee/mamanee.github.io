import React from 'react'
import Main from "./components/screens/Main";
import '@fortawesome/fontawesome-free/css/all.css'
import {DataContext, useDataContext} from "./data/DataContext";

function App() {

  const userData = useDataContext()
  return (
      <DataContext.Provider value={userData}>
        <Main/>
      </DataContext.Provider>
  );
}

export default App;
