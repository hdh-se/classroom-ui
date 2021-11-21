import { Avatar } from '@mui/material';
import { FolderOpen, PermContactCalendar } from '@mui/icons-material';
import React from 'react';
// import { Link } from 'react-router-dom';
import './MyClass.scss';
import { Link } from 'react-router-dom';

interface IMyClassProps {
  _id?: string;
  name?: string;
  section?: string;
  ownerAvt?: string;
  ownerName?: string;
}

export const MyClass: React.FC<IMyClassProps> = ({ name, section, ownerAvt, ownerName }) => {
  return (
    <li className="joined__list">
      <div className="joined__wrapper">
        <div className="joined__container">
          <div className="joined__img-wrapper" />
          <div className="joined__image" />
          <div className="joined__content">
            <Link className="joined__title" to={`/class-detail`}>
              <h2>{name}</h2>
              <span>{section}</span>
            </Link>
            {/* <a className="joined__title" href={`#`}>
              <h2>{name}</h2>
              <span>{section}</span>
            </a> */}
            <p className="joined__owner">{ownerName}</p>
          </div>
        </div>
        <Avatar className="joined__avatar" src={ownerAvt} />
      </div>
      <div className="joined__bottom">
        <PermContactCalendar />
        <FolderOpen />
      </div>
    </li>
  );
};