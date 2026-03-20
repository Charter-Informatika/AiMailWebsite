#!/usr/bin/env node
/**
 * SMTP Connection Tester
 * Teszt az email küldés beállítására
 * Használat: node test-smtp.mjs
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '2525', 10),
  secure: process.env.EMAIL_SERVER_PORT === '465',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  connectionTimeout: 5000,
  socketTimeout: 5000,
};

const from = process.env.EMAIL_FROM;

console.log('\n========= SMTP Configuration Test =========\n');
console.log('CONFIG:');
console.log(`  Host: ${config.host}`);
console.log(`  Port: ${config.port}`);
console.log(`  Secure (TLS/SSL): ${config.secure}`);
console.log(`  User: ${config.auth.user}`);
console.log(`  From: ${from}\n`);

(async () => {
  try {
    console.log('1. Creating transporter...');
    const transporter = nodemailer.createTransport(config);

    console.log('2. Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');

    console.log('3. Connection details:');
    const info = transporter.transporter;
    console.log(`  Status: Connected\n`);

    console.log('========= Test Result =========');
    console.log('✅ SMTP setup looks good!');
    console.log('\nIf emails still timeout:');
    console.log('  • Check firewall/network rules');
    console.log('  • Verify mail.nethely.hu accepts your credentials');
    console.log('  • Try port 587 (TLS) instead of 465\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ SMTP Test Failed:\n', error.message);
    console.log('\nTroubleshooting:');
    console.log('  • Verify EMAIL_SERVER_HOST is reachable');
    console.log('  • Check EMAIL_SERVER_USER and EMAIL_SERVER_PASSWORD');
    console.log('  • Ensure port 465 is open (or try 587)');
    console.log('  • Check .env file encoding (should be UTF-8)\n');
    process.exit(1);
  }
})();
