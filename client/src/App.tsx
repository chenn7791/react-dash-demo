/*
 * @Author: Chenn
 * @Date: 2026-04-25 09:35:39
 * @LastEditors: Chenn
 * @LastEditTime: 2026-04-25 10:49:03
 */
import { Box, Button, Chip, Container, Paper, Stack, Typography } from '@mui/material';
import { isElement } from 'react-is';
import { decrement, increment, incrementByAmount } from './features/counter/counterSlice';
import { useAppDispatch, useAppSelector } from './hooks';

function App() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  const frameworkBadge = (
    <Chip label="React 18 + TypeScript + Redux Toolkit + MUI" color="primary" />
  );

  return (
    <Container component="main" maxWidth="lg" className="app">
      <Paper elevation={3} sx={{ width: '100%', p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
        <Chip
          label="React 18 + TypeScript + Redux Toolkit + MUI"
          color="primary"
          variant={isElement(frameworkBadge) ? 'outlined' : 'filled'}
        />
        <Typography component="h1" variant="h4" sx={{ mt: 2, fontWeight: 700 }}>
          Client Counter
        </Typography>
        <Box
          component="output"
          aria-label="count"
          sx={{
            display: 'block',
            my: 4,
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {count}
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center">
          <Button variant="outlined" onClick={() => dispatch(decrement())}>
            -1
          </Button>
          <Button variant="contained" onClick={() => dispatch(increment())}>
            +1
          </Button>
          <Button variant="outlined" onClick={() => dispatch(incrementByAmount(5))}>
            +5
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default App;
