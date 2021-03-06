import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import FaviIcon from '../../assets/icons/favicon.ico';
import GIcon from '../../assets/icons/login/g-logo.png';
import { useAppContextApi, useAppDispatch } from '../../redux';
import { doLogin } from '../../redux/asyncThunk/authAction';
import { setMainToken } from '../../redux/slices/appSlices/authSlice';
import axiosMain from '../../services/axios/axiosMain';
import { isValidEmail } from '../../utils';
import {
  parseParams,
  setCurrentUser,
  setEmail,
  setFullName,
  setRefreshToken,
  setToken,
} from '../../utils/common';
import './Login.scss';

type FormValues = {
  username: string;
  password: string;
};

enum DialogState {
  NONE,
  INPUT_EMAIL,
  NOTIFY_SUCCESS,
  NOTIFY_FAIL,
  INPUT_NEWPASSWORD,
}

export const Login = () => {
  const { register, handleSubmit } = useForm();
  let query = parseParams(useLocation().search);

  const [isLoging, setIsLoging] = useState(false);
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = React.useState('');
  const [newPass, setNewPass] = React.useState('');
  const [reNewPass, setReNewPass] = React.useState('');
  const [restorePasswordToken, setRestorePasswordToken] = React.useState('');
  const Context = useAppContextApi();
  const [dialogState, setDialogState] = React.useState<DialogState>(DialogState.NONE);
  const [dialogMessage, setDialogMessage] = React.useState<string>('');

  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log(Object.keys(query).length);
    if (query['reset-password']) {
      const email = query['email'];
      const token = query['token'];
      axiosMain
        .get(`/Email/reset-password?token=${token}&email=${email}`)
        .then(({ data }) => {
          if (data !== 'Error') {
            setDialogState(DialogState.NOTIFY_SUCCESS);
            setDialogMessage('M???t kh???u m???i c???a b???n l??: ' + data);
          } else {
            setDialogState(DialogState.NOTIFY_FAIL);
            setDialogMessage('C?? l???i trong qu?? tr??nh kh??i ph???c m???t kh???u');
          }
        })
        .catch((e) => {});
      return;
    }
    if (Object.keys(query).length > 1) {
      setIsLoging(false);
      let token = query.token;
      let refreshToken = '';
      setToken(token);
      setRefreshToken(refreshToken);
      setCurrentUser(query.username);
      setEmail(query.email);
      setFullName(query.currentFullName);
      dispatch(setMainToken(token));

      window.location.replace('/');
    }
  }, []);

  const onSubmit = (data: FormValues) => {
    setIsLoging(true);
    dispatch(
      doLogin({
        username: data.username,
        password: data.password,
      } as IParamLogin),
    )
      .then(unwrapResult)
      .then((res: { content: IResLogin }) => {
        setIsLoging(false);
        let token = res.content.token;
        let currentUser = res.content.username;
        let currentEmail = res.content.email;
        let currentFullName = res.content.fullName;

        setToken(token);
        setRefreshToken(token);
        setCurrentUser(currentUser);
        setEmail(currentEmail);
        setFullName(currentFullName);
        dispatch(setMainToken(token));

        // if (query['redirect']) {
        //   window.location.replace(query['redirect']);
        // } else {
        window.location.replace('/');
        // }
      })
      .catch((err) => {
        setIsLoging(false);
        setError('*T??n ????ng nh???p ho???c m???t kh???u kh??ng ch??nh x??c!');
      });
  };

  const handleRestoreAccountByEmail = (email: string) => {
    if (email) {
      axiosMain
        .post('/users/reset-password', {
          email: email,
        })
        .then(({ data }) => {
          if (data.status === 400) {
            Context?.openSnackBarError('C?? l???i x???y ra');
          } else {
            setDialogState(DialogState.NOTIFY_SUCCESS);
            setDialogMessage('B???n vui l??ng check mail v???a nh???p ????? kh??i ph???c m???t kh???u');
          }
        });
    } else {
      Context?.openSnackBarError('Email ??i???n v??o r???ng vui l??ng check l???i');
    }
  };

  const handleProcessRestorePassword = (token: string) => {
    // if (token !== '') {
    // } else {
    // }
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="left-side__intro">
          <h1>HDH - Classroom</h1>
          <h2>Join to learning</h2>
        </div>
      </div>
      <div className="right-side">
        <div className="right-side__brand">
          <img src={FaviIcon} alt="icon" />
          <span>HDH - Classroom</span>
        </div>
        <div className="right-side__form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="right-side__form__title">
              <h2>????ng nh???p</h2>
            </div>
            <p className="right-side__form__error">{error ?? +error}</p>
            <div className="right-side__form__login-info">
              <TextField
                {...register('username')}
                required
                className="right-side__form__login-info__text-field"
                id="outlined-basic"
                type="text"
                label="T??n ????ng nh???p"
                variant="outlined"
              />
            </div>
            <div className="right-side__form__login-info">
              <TextField
                {...register('password')}
                required
                className="right-side__form__login-info__text-field"
                type="password"
                id="outlined-basic"
                label="M???t kh???u"
                variant="outlined"
              />
            </div>
            <LoadingButton
              type="submit"
              loading={isLoging}
              className="right-side__form__login-btn"
              variant="contained"
            >
              ????ng nh???p
            </LoadingButton>
            <p className="right-side__form__btn-separate">HO???C</p>
            <LoadingButton
              href={`${process.env.REACT_APP_BASE_API}users/login`}
              variant="outlined"
              className="right-side__form__login-btn"
              startIcon={<img alt="g-icon" src={GIcon} width="25" height="25" />}
            >
              Ti???p t???c v???i Google
            </LoadingButton>
            <p className="right-side__form__question">
              B???n ch??a c?? t??i kho???n? <Link to="/signup">????ng k??</Link>
              <br />
              Qu??n m???t kh???u ?{' '}
              <span
                onClick={() => {
                  setDialogState(DialogState.INPUT_EMAIL);
                }}
                className="restore-password"
              >
                Kh??i ph???c m???t kh???u
              </span>
            </p>
          </form>
        </div>
      </div>

      <Dialog
        fullWidth
        open={dialogState !== DialogState.NONE}
        onClose={() => setDialogState(DialogState.NONE)}
        maxWidth="sm"
      >
        {dialogState === DialogState.INPUT_EMAIL && (
          <>
            <DialogTitle>Kh??i ph???c m???t kh???u</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                type="email"
                placeholder="Nh???p v??o email li??n k???t t??i kho???n"
                value={resetEmail}
                error={!isValidEmail(resetEmail)}
                color="success"
                onChange={(e) => setResetEmail(e.target.value)}
                sx={{ marginBottom: '15px' }}
              />
              <Box display="flex" justifyContent="flex-end">
                <Button
                  onClick={() => handleRestoreAccountByEmail(resetEmail)}
                  variant="contained"
                  sx={{ borderRadius: 0 }}
                  color="warning"
                >
                  Kh??i ph???c
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
        {(dialogState === DialogState.NOTIFY_SUCCESS ||
          dialogState === DialogState.NOTIFY_FAIL) && (
          <>
            <DialogTitle>Th??ng b??o</DialogTitle>
            <DialogContent>
              <Alert
                severity={dialogState === DialogState.NOTIFY_SUCCESS ? 'success' : 'error'}
                sx={{ marginBottom: '10px' }}
              >
                {dialogMessage}
              </Alert>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  onClick={() => setDialogState(DialogState.NONE)}
                  variant="contained"
                  sx={{ borderRadius: 0 }}
                  color={dialogState === DialogState.NOTIFY_SUCCESS ? 'success' : 'warning'}
                >
                  ????ng
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
        {dialogState === DialogState.INPUT_NEWPASSWORD && (
          <>
            <DialogTitle>Nh???p m???t kh???u m???i ????? kh??i ph???c</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                type="password"
                placeholder="Nh???p m???t kh???u m???i"
                value={newPass}
                color="success"
                onChange={(e) => setNewPass(e.target.value)}
                sx={{ marginBottom: '15px' }}
              />
              <TextField
                fullWidth
                type="password"
                placeholder="X??c nh???n m???t kh???u"
                value={reNewPass}
                color="success"
                onChange={(e) => setReNewPass(e.target.value)}
                sx={{ marginBottom: '15px' }}
              />
              <Box display="flex" justifyContent="flex-end">
                <Button
                  onClick={() => handleProcessRestorePassword(restorePasswordToken)}
                  variant="contained"
                  sx={{ borderRadius: 0 }}
                  color="success"
                >
                  Kh??i ph???c
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  );
};
