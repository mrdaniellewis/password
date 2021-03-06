/*!
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/* eslint-disable no-bitwise,
                  no-plusplus,
                  no-mixed-operators,
                  camelcase,
                  eqeqeq,
                  max-len,
                  no-nested-ternary,
                  no-param-reassign
*/

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
const hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase  */
const b64pad = ''; /* base-64 pad character. "=" for strict RFC compliance   */
const chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode  */

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
  const lsw = (x & 0xFFFF) + (y & 0xFFFF);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
function str2binb(str) {
  const bin = [];
  const mask = (1 << chrsz) - 1;
  /* SC - Get rid of warnings */
  for (let i = 0; i < str.length * chrsz; i += chrsz) {
    if (bin[i >> 5] != undefined) {
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i % 32);
    } else {
      bin[i >> 5] = (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i % 32);
    }
  }
  return bin;
}

/*
 * Convert an array of big-endian words to a hex string.
 */
function binb2hex(binarray) {
  const hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
  let str = '';
  for (let i = 0; i < binarray.length * 4; i++) {
    str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF)
         + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
  }
  return str;
}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d) {
  if (t < 20) {
    return (b & c) | ((~b) & d);
  }
  if (t < 40) {
    return b ^ c ^ d;
  }
  if (t < 60) {
    return (b & c) | (b & d) | (c & d);
  }
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t) {
  return (t < 20) ? 1518500249 : (t < 40) ? 1859775393
    : (t < 60) ? -1894007588 : -899497514;
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len) {
  /* append padding */
  const p = (len >> 5);
  if (x[p] == undefined) {
    x[p] = 0x80 << (24 - len % 32);
  } else {
    x[p] |= 0x80 << (24 - len % 32);
  }
  x[((len + 64 >> 9) << 4) + 15] = len;

  const w = Array(80);
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;
  let e = -1009589776;

  for (let i = 0; i < x.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;
    const olde = e;

    for (let j = 0; j < 80; j++) {
      if (j < 16) {
        w[j] = x[i + j];
      } else {
        w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
      }
      const t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
        safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return [a, b, c, d, e];
}

/*
 * Calculate the HMAC-SHA1 of a key and some data
 */
function core_hmac_sha1(key, data) {
  let bkey = str2binb(key);
  if (bkey.length > 16) {
    bkey = core_sha1(bkey, key.length * chrsz);
  }

  const ipad = Array(16); const
    opad = Array(16);
  for (let i = 0; i < 16; i++) {
    const k = (bkey[i] != undefined ? bkey[i] : 0);
    ipad[i] = k ^ 0x36363636;
    opad[i] = k ^ 0x5C5C5C5C;
  }

  const hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
  return core_sha1(opad.concat(hash), 512 + 160);
}

/*
 * Convert an array of big-endian words to a base-64 string
 */
function binb2b64(binarray) {
  const tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let str = '';
  for (let i = 0; i < binarray.length * 4; i += 3) {
    const b1 = binarray[i >> 2] != undefined ? ((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16 : 0;
    const b2 = binarray[i + 1 >> 2] != undefined ? ((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8 : 0;
    const b3 = binarray[i + 2 >> 2] != undefined ? ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF) : 0;
    const triplet = b1 | b2 | b3;
    for (let j = 0; j < 4; j++) {
      if (i * 8 + j * 6 > binarray.length * 32) {
        str += b64pad;
      } else {
        str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
      }
    }
  }
  return str;
}

const b64HmacSha1 = (key, data) => binb2b64(core_hmac_sha1(key, data));
const hexSha1 = s => binb2hex(core_sha1(str2binb(s), s.length * chrsz));

export { b64HmacSha1, hexSha1 };
