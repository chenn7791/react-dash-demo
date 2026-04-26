/*
 * @Author: Chenn
 * @Date: 2026-04-25 09:35:39
 * @LastEditors: Chenn
 * @LastEditTime: 2026-04-25 17:40:59
 */
import {
  AppBar,
  Container,
  Grid,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Cards from './Cards';
import { useAppSelector } from './hooks';

function App() {
  const { i18n, t } = useTranslation();
  const card = useAppSelector((state) => state.card);
  return (
    <Container component="main" maxWidth="lg" className="app">
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          p: { xs: 2, sm: 3 },
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          textAlign: 'center',
        }}
      >
        <AppBar position="static" elevation={0} sx={{ borderRadius: 1.5 }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'left' }}>
              {t('board.title')}
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={i18n.resolvedLanguage}
              aria-label={t('app.language')}
              sx={{
                ml: 'auto',
                '& .MuiToggleButton-root': {
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '& .MuiToggleButton-root.Mui-selected': {
                  color: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.16)',
                },
                '& .MuiToggleButton-root.Mui-selected:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.24)',
                },
              }}
              onChange={(_, language: string | null) => {
                if (language) {
                  void i18n.changeLanguage(language);
                }
              }}
            >
              <ToggleButton value="zh-CN">{t('language.zh')}</ToggleButton>
              <ToggleButton value="en">{t('language.en')}</ToggleButton>
            </ToggleButtonGroup>
          </Toolbar>
        </AppBar>
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={4}>
            <Cards type="todo" cards={card.todo} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Cards type="doing" cards={card.doing} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Cards type="done" cards={card.done} />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default App;
