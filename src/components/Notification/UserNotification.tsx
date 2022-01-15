import CheckIcon from '@mui/icons-material/Check';
import FullNotificationsIcon from '@mui/icons-material/Notifications';
import EmptyNotificationsIcon from '@mui/icons-material/NotificationsNone';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { Avatar, Badge, Button, Card, Divider, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { Link } from 'react-router-dom';
import { GREEN_COLOR } from '../../constants';
import { useAppSelector } from '../../redux';
import './UserNotification.scss';

interface INotification {
  id: number;
  senderName: string;
  message: string;
  idGradeReview: number;
  seen: boolean;
}

const response = {
  data: {
    amountUnseen: 0,
    notifications: [
      {
        id: 1,
        senderName: 'ABC',
        message: 'Xin chao abcd 13328932732894',
        idGradeReview: 1,
        seen: false,
      },
      {
        id: 1,
        senderName: 'ABC',
        message: 'Xin chao abcd 13328932732894',
        idGradeReview: 1,
        seen: false,
      },
      {
        id: 1,
        senderName: 'ABC',
        message: 'Xin chao abcd 13328932732894',
        idGradeReview: 1,
        seen: false,
      },
      {
        id: 1,
        senderName: 'ABC',
        message: 'Xin chao abcd 13328932732894',
        idGradeReview: 1,
        seen: false,
      },
      {
        id: 1,
        senderName: 'ABC',
        message: 'Xin chao abcd 13328932732894',
        idGradeReview: 1,
        seen: false,
      },
      {
        id: 1,
        senderName: 'ABC',
        message: 'Xin chao abcd 13328932732894',
        idGradeReview: 1,
        seen: false,
      },
      {
        id: 1,
        senderName: 'ABC',
        message: 'Xin chao abcd 13328932732894',
        idGradeReview: 1,
        seen: false,
      },
      {
        id: 1,
        senderName: 'ABC',
        message: 'Xin chao abcd 13328932732894',
        idGradeReview: 1,
        seen: false,
      },
    ],
  },
  hasMore: true,
  total: 0,
};
export const UserNotification = () => {
  const [isFullNotification, setIsFullNotification] = React.useState(
    response.data.amountUnseen > 0,
  );

  const [isShowNotification, setIsShowNotification] = React.useState(false);
  const handleLoadMore = () => {};
  return (
    <div className="notification">
      <IconButton onClick={() => setIsShowNotification(!isShowNotification)}>
        <Badge
          badgeContent={5}
          color="error"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClick={() => {}}
        >
          {isFullNotification ? <FullNotificationsIcon /> : <EmptyNotificationsIcon />}
        </Badge>
      </IconButton>

      {isShowNotification && (
        <Card variant="outlined" className="notification__body">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            sx={{ width: '100%', padding: '5px', backgroundColor: 'rgba(green,1)' }}
          >
            <Typography variant="h5">
              <strong>Thông báo</strong>
            </Typography>
            <Divider sx={{ borderColor: 'green', width: '80%', marginTop: '10px' }} light={true} />
          </Box>

          <div className="notification__body__content">
            {response.data.notifications.length > 0 ? (
              <>
                {response.data.notifications.map((not, index) => {
                  return (
                    <NotificationItem
                      key={index}
                      id={not.id}
                      idGradeReview={not.idGradeReview}
                      message={not.message}
                      senderName={not.senderName}
                      seen={not.seen}
                    />
                  );
                })}
                {response.hasMore && (
                  <Button
                    color="success"
                    variant="contained"
                    sx={{ borderRadius: '0' }}
                    onClick={handleLoadMore}
                  >
                    Tải thêm
                  </Button>
                )}
              </>
            ) : (
              <Typography variant="h6" color="initial">
                Bạn không có thông báo nào
              </Typography>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

const NotificationItem: React.FC<INotification> = ({
  id,
  idGradeReview,
  message,
  seen,
  senderName,
}) => {
  const avatarRand = useAppSelector((state) => state.utilsReducer.randomUserAvt);
  return (
    <Link className="notification__item__wrapper" to={'grade-review'}>
      <div className="notification__item">
        <Divider sx={{ width: '90%', marginBottom: '8px' }} />
        <Box display="flex" justifyContent="space-between">
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            gap="8px"
            sx={{ margin: '20px' }}
          >
            <Avatar src={avatarRand} />
            <Divider orientation="vertical" sx={{ height: '100%' }} />
            <Box display="flex" flexDirection="column">
              <h6>{senderName}</h6>
              <span>{message}</span>
            </Box>
          </Box>
          {seen ? (
            <CheckIcon sx={{ color: GREEN_COLOR }} />
          ) : (
            <RadioButtonCheckedIcon sx={{ color: 'rgba(red,0.8)' }} />
          )}
        </Box>
      </div>
    </Link>
  );
};