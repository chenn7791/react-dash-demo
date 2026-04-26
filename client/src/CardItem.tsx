import { DragEvent } from 'react';
import { IconButton, ListItem, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CardType, ICard } from './features/card/interface';

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
  const nextType = nextTypeMap[type];

  return (
    <ListItem
      divider
      draggable
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
      <ListItemText primary={card.message} sx={{ minWidth: 0 }} />
      {nextType ? (
        <IconButton
          aria-label={t('board.advance')}
          title={t('board.advance')}
          sx={{
            ml: 1,
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
    </ListItem>
  );
}

export default CardItem;
