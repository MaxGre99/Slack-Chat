import { useContext } from 'react';
import socketContext from '../contexts/SocketContext';

const useSocket = () => useContext(socketContext);

export default useSocket;
