import { DragEvent, useState } from 'react';
import {
  Box,
  Button,
  List,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CardItem from './CardItem';
import { addCard, moveCard } from './features/card/cardSlice';
import { CardType, ICard } from './features/card/interface';
import { useAppDispatch } from './hooks';

interface CardsProps {
  type: CardType;
  cards: ICard[];
}

const titleKeyMap: Record<CardType, string> = {
  todo: 'board.todoList',
  doing: 'board.doingList',
  done: 'board.doneList',
};

function Cards({ type, cards }: CardsProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [draft, setDraft] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isOver, setIsOver] = useState(false);

  const handleAdd = () => {
    const message = draft.trim();

    if (!message) {
      return;
    }

    const id = crypto.randomUUID();
    const card: ICard = {
      id,
      key: id,
      message,
    };

    dispatch(addCard({ cardType: type, card }));
    setDraft('');
    setIsAdding(false);
  };

  const handleAdvance = (card: ICard, currentType: CardType) => {
    const nextTypeMap: Partial<Record<CardType, CardType>> = {
      todo: 'doing',
      doing: 'done',
    };
    const nextType = nextTypeMap[currentType];

    if (!nextType) {
      return;
    }

    dispatch(
      moveCard({
        from: currentType,
        to: nextType,
        cardId: card.id,
      }),
    );
  };

  const handleDragStart = (
    event: DragEvent<HTMLLIElement>,
    card: ICard,
    currentType: CardType,
  ) => {
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify({ cardId: card.id, from: currentType }),
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (event: DragEvent<HTMLUListElement>) => {
    event.preventDefault();
    setIsOver(false);

    const data = event.dataTransfer.getData('application/json');

    if (!data) {
      return;
    }

    const payload = JSON.parse(data) as { cardId: string; from: CardType };
    dispatch(
      moveCard({
        from: payload.from,
        to: type,
        cardId: payload.cardId,
      }),
    );
  };

  const handleItemDrop = (event: DragEvent<HTMLLIElement>, targetCard: ICard) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOver(false);

    const data = event.dataTransfer.getData('application/json');

    if (!data) {
      return;
    }

    const payload = JSON.parse(data) as { cardId: string; from: CardType };
    dispatch(
      moveCard({
        from: payload.from,
        to: type,
        cardId: payload.cardId,
        targetCardId: targetCard.id,
      }),
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        overflow: 'hidden',
        border: 1,
        borderRadius: 2,
        backgroundColor: '#ffffff',
        borderColor: isOver ? 'primary.main' : 'divider',
        boxShadow: isOver
          ? '0 0 0 2px rgba(37, 99, 235, 0.18)'
          : '0 10px 28px rgba(15, 23, 42, 0.08)',
        transition: 'border-color 120ms ease, box-shadow 120ms ease',
      }}
      onDragLeave={() => setIsOver(false)}
    >
      <Toolbar
        sx={{
          minHeight: 56,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          px: 2.5,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
          {t(titleKeyMap[type])}
        </Typography>
        <Button
          color="inherit"
          size="small"
          sx={{
            ml: 'auto',
            minWidth: 64,
            borderRadius: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
          onClick={() => setIsAdding((current) => !current)}
        >
          {t('board.add')}
        </Button>
      </Toolbar>
      {isAdding ? (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}>
          <Stack spacing={1.5}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              placeholder={t('board.addPlaceholder')}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleAdd();
                }
              }}
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                variant="text"
                onClick={() => {
                  setDraft('');
                  setIsAdding(false);
                }}
              >
                {t('board.cancelAdd')}
              </Button>
              <Button variant="contained" onClick={handleAdd}>
                {t('board.confirmAdd')}
              </Button>
            </Stack>
          </Stack>
        </Box>
      ) : null}
      <List
        disablePadding
        sx={{
          minHeight: 240,
          p: 1,
          backgroundColor: isOver ? 'action.hover' : 'transparent',
          transition: 'background-color 120ms ease',
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'move';
          if (!isOver) {
            setIsOver(true);
          }
        }}
        onDrop={handleDrop}
      >
        {cards.length > 0 ? (
          cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              type={type}
              onAdvance={handleAdvance}
              onDrop={handleItemDrop}
              onDragStart={handleDragStart}
            />
          ))
        ) : (
          <Box sx={{ px: 2, py: 3, color: 'text.secondary', textAlign: 'center' }}>
            {t('board.empty')}
          </Box>
        )}
      </List>
    </Paper>
  );
}

export default Cards;
