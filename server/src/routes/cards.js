const crypto = require('crypto');
const express = require('express');
const { all, run } = require('../lib/database');

const router = express.Router();
const cardTypes = new Set(['todo', 'doing', 'done']);

function isValidCardType(type) {
  return cardTypes.has(type);
}

router.get('/', async (_req, res, next) => {
  try {
    const rows = await all('SELECT * FROM cards ORDER BY type, position, created_at');
    res.json({ data: rows });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { message, type = 'todo' } = req.body;

    if (!isValidCardType(type)) {
      res.status(400).json({ error: 'Invalid card type' });
      return;
    }

    if (typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const [{ nextPosition }] = await all(
      'SELECT COALESCE(MAX(position), -1) + 1 AS nextPosition FROM cards WHERE type = ?',
      [type],
    );
    const id = crypto.randomUUID();
    const trimmedMessage = message.trim();

    await run('INSERT INTO cards (id, type, message, position) VALUES (?, ?, ?, ?)', [
      id,
      type,
      trimmedMessage,
      nextPosition,
    ]);

    res.status(201).json({
      data: {
        id,
        type,
        message: trimmedMessage,
        position: nextPosition,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { message, position, type } = req.body;
    const updates = [];
    const params = [];

    if (type !== undefined) {
      if (!isValidCardType(type)) {
        res.status(400).json({ error: 'Invalid card type' });
        return;
      }

      updates.push('type = ?');
      params.push(type);
    }

    if (message !== undefined) {
      if (typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'Message must not be empty' });
        return;
      }

      updates.push('message = ?');
      params.push(message.trim());
    }

    if (position !== undefined) {
      if (!Number.isInteger(position) || position < 0) {
        res.status(400).json({ error: 'Position must be a non-negative integer' });
        return;
      }

      updates.push('position = ?');
      params.push(position);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.params.id);

    const result = await run(`UPDATE cards SET ${updates.join(', ')} WHERE id = ?`, params);

    if (result.changes === 0) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }

    res.json({ data: { id: req.params.id } });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await run('DELETE FROM cards WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = router;
