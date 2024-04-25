import React from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';

function App() {
  const handleContextMenu = (event) => {
    event.preventDefault();
  };

  React.useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <>
      <Sidebar/>
      <Main/>
    </>
  );
}

export default App;