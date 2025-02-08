import React from 'react';
import AddDataModal, { Button } from './AddDataModal';
import { useModalStore } from '@/store/useModalStore';

interface HeaderProps {
    className?: string;
}

const Header: React.FC<HeaderProps> = ({className}) => {
    const {openModal} = useModalStore();
    return (
        <header className={`${className} flex justify-between items-center z-9 events-auto`}>
            <h1>Journal cTrader</h1>
            <Button onClick={openModal}>Add Trades</Button>
        </header>
    );
};

export default Header;