// lib/email-templates/opsNotificationTemplate.ts

export interface OpsNotificationProps {
  title: string;
  summary?: string;
  data?: Record<string, any>;
}

export function opsNotificationTemplate({ title, summary, data = {} }: OpsNotificationProps) {
  const rows = Object.entries(data)
    .map(([key, value]) => `<tr><td style="padding:6px 10px;font-weight:500;text-transform:capitalize;">${key}</td><td style="padding:6px 10px;color:#333;">${value}</td></tr>`)
    .join("");
  return `
    <div style="background:#fff;border-radius:10px;font-family:'Segoe UI',Roboto,sans-serif;color:#111;line-height:1.5;max-width:600px;margin:0 auto;border:1px solid #eaeaea;padding:24px;">
      <h2 style="color:#0070f3;margin-top:0;">${title}</h2>
      ${summary ? `<p style="font-size:15px;color:#444;margin-bottom:16px;">${summary}</p>` : ""}
      ${rows ? `<table style="width:100%;border-collapse
