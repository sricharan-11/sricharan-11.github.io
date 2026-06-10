// One-time encryption script — run with: node encrypt.mjs
// Encrypts the message HTML with the password using AES-256-GCM + PBKDF2
// Output: paste the JSON into the HTML page, then delete this file.

import { webcrypto } from 'node:crypto';
const { subtle } = webcrypto;

const PASSWORD = '+ve-approach-costs-nothing-beyond-2mins';

// The message content as styled HTML
const PLAINTEXT = `
<div class="letter-header">
  <span class="letter-to">Dear Dr. Tarek,</span>
</div>

<div class="letter-body">
  <p>I was referred by <strong>Yasser Shabaan</strong> with a good faith that I will be an asset to Humain.</p>
  <p>I was scheduled an interview with you and Zaki on <strong>19th May</strong> and unfortunately you couldn't join the same.</p>
  <p>Hassan AlMitib has joined instead, along with Zaki.</p>

  <div class="highlight-block">
    <p>I can see that there's a disconnect in Hassan's expectation vs the job role I was expecting. I was expecting a <strong>hands-on builder role — system design, architecting solutions end to end</strong> — while Hassan was asking me questions optimized for L1 support.</p>
    <p>Given that, I had great expectations on HUMAIN and didn't want to let go of the opportunity due to a random mismatch of expectations.</p>
  </div>

  <p>I have explained this mismatch to HR (Linah) over a phone call and asked her for a correction in expectation or a relevant chance — and it led nowhere.</p>
  <p>I am confident I will be a great asset, given that I consider myself a <strong>perpetual learner</strong>.</p>
  <p>Further, I am not just a good tech resource — I have fair <strong>business and productization acumens</strong>.</p>
  <p>I would love to show my worth to you directly.</p>
  <p>Please go through my profile — <a href="https://sricharan-11.github.io" target="_blank" class="profile-link">sricharan-11.github.io</a> — and decide yourself.</p>

  <div class="note-block">
    <p>I am not expecting you to officially change the hiring cycle with this message. Rather, if you take an interview off the records and get convinced that the mismatch is genuine, then you can take an appropriate action.</p>
  </div>

  <p>Looking at my resume and my portfolio, if you can see good potential, please allow me to have a direct interview with you — the least I can assure you is that <strong>your 40 mins will not be a waste of time</strong>.</p>

  <p class="side-note">On a side note: irrespective of the final outcomes, I would say that it's honorary to talk to builders of HUMAIN.</p>
</div>

<div class="letter-footer">
  <p>Thanks,</p>
  <p class="signature">Sri Charan</p>
</div>
`;

async function encrypt() {
  const enc = new TextEncoder();
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv   = webcrypto.getRandomValues(new Uint8Array(12));

  // Derive key from password via PBKDF2
  const keyMaterial = await subtle.importKey(
    'raw', enc.encode(PASSWORD), 'PBKDF2', false, ['deriveKey']
  );
  const key = await subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 600000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  // Encrypt
  const ciphertext = await subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(PLAINTEXT)
  );

  // Convert to base64
  const toB64 = (buf) => Buffer.from(buf).toString('base64');

  const payload = {
    salt: toB64(salt),
    iv: toB64(iv),
    ciphertext: toB64(ciphertext),
    iterations: 600000
  };

  console.log('// Paste this into the HTML page as the ENCRYPTED_PAYLOAD:');
  console.log(JSON.stringify(payload, null, 2));
}

encrypt();
