from app.security import create_token, hash_password, read_token_user_id, verify_password


def test_password_hash_verification_roundtrip() -> None:
    password_hash = hash_password("bardzo-tajne-haslo")

    assert password_hash.startswith("pbkdf2_sha256$")
    assert verify_password("bardzo-tajne-haslo", password_hash)
    assert not verify_password("zle-haslo", password_hash)


def test_signed_token_roundtrip_and_tamper_detection() -> None:
    token = create_token("u-123")

    assert read_token_user_id(token) == "u-123"
    assert read_token_user_id(f"{token}x") is None
    assert read_token_user_id("not-a-token") is None
