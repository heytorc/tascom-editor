import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Typography as Text
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { VisibilityOff, Visibility, Login } from '@mui/icons-material';
import { useForm, SubmitHandler } from 'react-hook-form';

import { useAuth } from '@/commons/contexts/auth.context';

interface IFormInput {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setError } = useForm<IFormInput>();
  const { signIn } = useAuth();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => console.log('errors', errors), [errors]);

  const handleLogin: SubmitHandler<IFormInput> = async (data) => {
    console.log('errors', errors);
    // if (data.username === 'admin') setError('username', { message: 'username is invalid', type: 'validate' })
    await signIn(data);
  };

  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      height={'100vh'}
    >
      <Paper
        elevation={4}
      >
        <Stack
          bgcolor={'white'}
          padding={5}
        >
          <Stack>
            <Text variant="h5" align="center" marginBottom={5}>Tascom Editor</Text>
          </Stack>

          <form onSubmit={handleSubmit(handleLogin)}>
            <Stack>
              <FormControl sx={{ mb: 2, width: '25ch' }} variant="outlined">
                <InputLabel
                  htmlFor="login-username"
                  error={!!errors.username?.type}
                >
                  Usuário
                </InputLabel>
                <OutlinedInput
                  {...register("username", { required: true })}
                  error={!!errors.username?.type}
                  id="login-username"
                  label="Usuário"
                />
              </FormControl>
              <FormControl sx={{ mb: 2, width: '25ch' }} variant="outlined">
                <InputLabel
                  htmlFor="login-password"
                  error={!!errors.password?.type}
                >
                  Senha
                </InputLabel>
                <OutlinedInput
                  {...register("password", { required: true })}
                  id="login-password"
                  label="Senha"
                  error={!!errors.password?.type}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((prevState: boolean) => !prevState)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              {errors.username?.message && (<Text>{errors.username.message}</Text>)}
              {errors.password?.message && (<Text>{errors.password.message}</Text>)}

              <LoadingButton
                type="submit"
                color="secondary"
                loadingPosition="start"
                variant={'contained'}
                startIcon={<Login />}
                loading={isSubmitting}
                fullWidth
              >
                Entrar
              </LoadingButton>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
}