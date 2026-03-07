from uncorreotemporal_mcp.utils.email_parser import (
    extract_otp_candidates,
    extract_verification_link_candidates,
)


def test_extract_otp_candidates_prefers_keyword_context():
    text = "Ref: 1234. Your verification code is 987654 for login."
    candidates = extract_otp_candidates(text)
    assert candidates[0] == "987654"
    assert "1234" in candidates


def test_extract_otp_candidates_empty_when_invalid_range():
    assert extract_otp_candidates("code 123456", otp_length_min=8, otp_length_max=4) == []


def test_extract_verification_link_candidates_prefers_domain_and_keywords():
    text = (
        "Use this link https://foo.com/home now. "
        "Verify here: https://example.com/verify?token=abc"
    )
    candidates = extract_verification_link_candidates(
        text,
        preferred_domains=["example.com"],
    )
    assert candidates[0].startswith("https://example.com/verify")


def test_extract_verification_link_candidates_empty_when_no_urls():
    assert extract_verification_link_candidates("no links here") == []
