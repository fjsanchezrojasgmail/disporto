/**
@author rgcarcedo
*/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function encriptaAES (msgEncriptar: string, seed: string, dificultad: number) {
    const hashKey = await ofuscarClave(seed, dificultad)
    const iv = await generarVectorIni(seed, msgEncriptar)
  
    const key = await window.crypto.subtle.importKey(
      'raw',
      hashKey, {
        name: 'AES-GCM'
      },
      false,
      ['encrypt']
    )
  
    const encriptado = await window.crypto.subtle.encrypt({
      name: 'AES-GCM',
      iv,
      additionalData: new TextEncoder().encode('nvn')
    },
    key,
    new TextEncoder().encode(msgEncriptar)
    )
  
    const resultado = Array.from(iv).concat(Array.from(new Uint8Array(encriptado)))
  
    return base64Encode(new Uint8Array(resultado))
  }
  
  function base64Encode (buffer: Iterable<number>) {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }
  
  function ofuscarClave (seed: string, dificultad: number) {
    return pbkdf2(seed, seed + seed, 10000, 32, 'SHA-256') // Math.pow(2, dificultad)
  }
  
  function generarVectorIni (seed: string, msgEncriptar: string) {
    const randomData = base64Encode(window.crypto.getRandomValues(new Uint8Array(12)))
    return pbkdf2(seed + randomData, msgEncriptar + (new Date().getTime().toString()), 1, 12, 'SHA-256')
  }
  
  async function pbkdf2 (msg: string, matClave: string, iteraciones: number, tamClave: number, algoritmo: string) {
    const msgBuffer = new TextEncoder().encode(msg)
    const msgUint8Array = new Uint8Array(msgBuffer)
    const saltBuffer = new TextEncoder().encode(matClave)
    const saltUint8Array = new Uint8Array(saltBuffer)
  
    const key = await window.crypto.subtle.importKey('raw', msgUint8Array, {
      name: 'PBKDF2'
    }, false, ['deriveBits'])
  
    const buffer = await window.crypto.subtle.deriveBits({
      name: 'PBKDF2',
      salt: saltUint8Array,
      iterations: iteraciones,
      hash: algoritmo
    }, key, tamClave * 8)
  
    return new Uint8Array(buffer)
  }
  