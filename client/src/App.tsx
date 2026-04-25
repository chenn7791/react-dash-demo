/*
 * @Author: Chenn
 * @Date: 2026-04-25 09:35:39
 * @LastEditors: Chenn
 * @LastEditTime: 2026-04-25 10:49:03
 */
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { isElement } from 'react-is';
import { decrement, increment, incrementByAmount } from './features/counter/counterSlice';
import { useAppDispatch, useAppSelector } from './hooks';

function App() {
  const { i18n, t } = useTranslation();
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  const frameworkBadge = <Chip label={t('app.badge')} color="primary" />;

  return (
    <Container component="main" maxWidth="lg" className="app">
      <Paper elevation={3} sx={{ width: '100%', p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={i18n.resolvedLanguage}
            aria-label={t('app.language')}
            onChange={(_, language: string | null) => {
              if (language) {
                void i18n.changeLanguage(language);
              }
            }}
          >
            <ToggleButton value="zh-CN">{t('language.zh')}</ToggleButton>
            <ToggleButton value="en">{t('language.en')}</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <Chip
          label={t('app.badge')}
          color="primary"
          variant={isElement(frameworkBadge) ? 'outlined' : 'filled'}
        />
        <Typography component="h1" variant="h4" sx={{ mt: 2, fontWeight: 700 }}>
          {t('app.title')}
        </Typography>
        <Box
          component="output"
          aria-label={t('app.countLabel')}
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
            {t('counter.decrement')}
          </Button>
          <Button variant="contained" onClick={() => dispatch(increment())}>
            {t('counter.increment')}
          </Button>
          <Button variant="outlined" onClick={() => dispatch(incrementByAmount(5))}>
            {t('counter.incrementByAmount')}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default App;
