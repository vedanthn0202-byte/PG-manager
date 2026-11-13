import base64
import hashlib
import hmac
import secrets


SCRYPT_N = 2**15
SCRYPT_R = 8
SCRYPT_P = 1


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    derived_key = hashlib.scrypt(
        password.encode("utf-8"),
        salt=salt,
        n=SCRYPT_N,
        r=SCRYPT_R,
        p=SCRYPT_P,
        dklen=32,
        maxmem=64 * 1024 * 1024,
    )
    salt_text = base64.urlsafe_b64encode(salt).decode("ascii")
    key_text = base64.urlsafe_b64encode(derived_key).decode("ascii")
    return f"scrypt${SCRYPT_N}${SCRYPT_R}${SCRYPT_P}${salt_text}${key_text}"


def verify_password(password: str, encoded_hash: str) -> bool:
    try:
        algorithm, n, r, p, salt_text, key_text = encoded_hash.split("$")
        if algorithm != "scrypt":
            return False
        salt = base64.urlsafe_b64decode(salt_text.encode("ascii"))
        expected_key = base64.urlsafe_b64decode(key_text.encode("ascii"))
        actual_key = hashlib.scrypt(
            password.encode("utf-8"),
            salt=salt,
            n=int(n),
            r=int(r),
            p=int(p),
            dklen=len(expected_key),
            maxmem=64 * 1024 * 1024,
        )
        return hmac.compare_digest(actual_key, expected_key)
    except (ValueError, TypeError):
        return False
