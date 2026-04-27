import { DragEvent, useState } from 'react';
import { Box, Button, IconButton, ListItem, ListItemText, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { deleteCardAsync, updateCardAsync } from './features/card/cardSlice';
import { CardType, ICard } from './features/card/interface';
import { useAppDispatch } from './hooks';

interface CardItemProps {
  card: ICard;
  type: CardType;
  onAdvance: (card: ICard, type: CardType) => void;
  onDrop: (event: DragEvent<HTMLLIElement>, targetCard: ICard) => void;
  onDragStart: (event: DragEvent<HTMLLIElement>, card: ICard, type: CardType) => void;
}

const nextTypeMap: Partial<Record<CardType, CardType>> = {
  todo: 'doing',
  doing: 'done',
};

function CardItem({ card, type, onAdvance, onDrop, onDragStart }: CardItemProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [draft, setDraft] = useState(card.message);
  const [isEditing, setIsEditing] = useState(false);
  const nextType = nextTypeMap[type];

  const handleUpdate = () => {
    const message = draft.trim();

    if (!message) {
      return;
    }

    void dispatch(updateCardAsync({ cardId: card.id, message }));
    setIsEditing(false);
  };

  return (
    <ListItem
      divider
      draggable={!isEditing}
      sx={{
        mb: 1,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
        cursor: 'grab',
        transition: 'border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease',
        '&:hover': {
          borderColor: 'primary.light',
          boxShadow: '0 6px 18px rgba(15, 23, 42, 0.1)',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          cursor: 'grabbing',
        },
      }}
      onDragStart={(event) => onDragStart(event, card, type)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => onDrop(event, card)}
    >
      {isEditing ? (
        <Box sx={{ width: '100%' }}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleUpdate();
              }
            }}
          />
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
            <Button
              size="small"
              onClick={() => {
                setDraft(card.message);
                setIsEditing(false);
              }}
            >
              {t('board.cancelAdd')}
            </Button>
            <Button size="small" variant="contained" onClick={handleUpdate}>
              {t('board.confirmAdd')}
            </Button>
          </Stack>
        </Box>
      ) : (
        <>
          <ListItemText primary={card.message} sx={{ minWidth: 0 }} />
          <Stack direction="row" spacing={0.5} sx={{ ml: 1, flexShrink: 0 }}>
            <Button size="small" onClick={() => setIsEditing(true)}>
              {t('board.edit')}
            </Button>
            <Button
              color="error"
              size="small"
              onClick={() => void dispatch(deleteCardAsync(card.id))}
            >
              {t('board.delete')}
            </Button>
            {nextType ? (
              <IconButton
                aria-label={t('board.advance')}
                title={t('board.advance')}
                sx={{
                  flexShrink: 0,
                  width: 34,
                  height: 34,
                  backgroundColor: 'action.hover',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                  },
                }}
                onClick={() => onAdvance(card, type)}
              >
                {'>'}
              </IconButton>
            ) : null}
          </Stack>
        </>
      )}
    </ListItem>
  );
}

export default CardItem;
