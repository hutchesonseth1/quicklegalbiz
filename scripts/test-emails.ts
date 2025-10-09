import 'dotenv/config';
import { sendNotification } from '../lib/notify-config';

async function main() {
  console.log('📤 Sending QuickLegalBiz test emails...\n');

  const emails = [
    {
      to: process.env.ADMIN_EMAIL!,
      subject: '🚨 Admin Alert Test — QuickLegalBiz',
      html: '<p>This is a test alert for the Admin notification system.</p>',
    },
    {
      to: process.env.OPERATIONS_EMAIL!,
      subject: '📬 Operations Test — QuickLegalBiz',
      html: '<p>This is a test message for the operations notification workflow.</p>',
    },
    {
      to: process.env.USER_EMAIL!,
      subject: '✅ User Confirmation Test — QuickLegalBiz',
      html: '<p>This confirms the user notification system is active and online.</p>',
    },
  ];

  for (const mail of emails) {
    try {
      console.log(`📨 Sending to ${mail.to}...`);
      await sendNotification(mail);
    } catch (err) {
      console.error(`❌ Failed to send to ${mail.to}`, err);
    }
  }

  console.log('\n🎉 All test notifications processed!');
}

main();
