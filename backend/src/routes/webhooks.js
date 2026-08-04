import express from 'express';
import { Router } from 'express';
import { verifyWebhook } from '@clerk/express/webhooks';
import { upsertUser, deleteUser } from '../db.js';

const router = Router();

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch (error) {
    console.error('Webhook verification failed:', error.message);
    return res.status(400).json({ error: 'Webhook verification failed' });
  }

  const { type, data } = evt;

  try {
    if (type === 'user.created' || type === 'user.updated') {
      await upsertUser({
        id: data.id,
        username: data.username ?? null,
        email: data.email_addresses?.[0]?.email_address ?? null,
      });
    } else if (type === 'user.deleted' && data.id) {
      await deleteUser(data.id);
    }
  } catch (error) {
    console.error('Error processing webhook:', error.message);
    return res.status(500).json({ error: 'Failed to process webhook' });
  }

  res.status(200).json({ success: true });
});

export default router;
