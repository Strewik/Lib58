// import {useState} from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const cardData = [
    { id: 1, title: 'Card 1', content: 'This is content for card 1' },
    { id: 2, title: 'Card 2', content: 'This is content for card 2' },
    { id: 3, title: 'Card 3', content: 'This is content for card 3' },
    { id: 4, title: 'Card 4', content: 'This is content for card 4' },
    { id: 5, title: 'Card 5', content: 'This is content for card 5' },
    { id: 6, title: 'Card 6', content: 'This is content for card 6' },
    { id: 7, title: 'Card 7', content: 'This is content for card 7' },
    { id: 8, title: 'Card 8', content: 'This is content for card 8' },
    { id: 9, title: 'Card 9', content: 'This is content for card 9' },
  ];

  return (
    <div className="card-grid">
      {cardData.map((card) => (
        <div key={card.id} className="card">
          <h3 className="card-title">{card.title}</h3>
          <p className="card-content">{card.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
