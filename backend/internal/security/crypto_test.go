package security

import (
	"testing"
)

func TestEncryptDecrypt(t *testing.T) {
	key := "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
	enc, err := NewEncryptor(key)
	if err != nil {
		t.Fatalf("failed to init encryptor: %v", err)
	}

	plaintext := "Pesan ancaman penagihan kasar: Kami akan sebar data kontak Anda!"
	ciphertext, err := enc.Encrypt(plaintext)
	if err != nil {
		t.Fatalf("failed to encrypt: %v", err)
	}

	if ciphertext == plaintext {
		t.Fatal("ciphertext should not match plaintext")
	}

	decrypted, err := enc.Decrypt(ciphertext)
	if err != nil {
		t.Fatalf("failed to decrypt: %v", err)
	}

	if decrypted != plaintext {
		t.Fatalf("expected %s, got %s", plaintext, decrypted)
	}
}
