from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Iterable
from urllib.parse import urlparse

OTP_CONTEXT_KEYWORDS = ("otp", "code", "verification", "verify", "pin")
LINK_CONTEXT_KEYWORDS = ("verify", "verification", "confirm", "activate", "signup")
URL_PATTERN = re.compile(r"https?://[^\s<>\"']+")


@dataclass
class RankedCandidate:
    value: str
    score: int


def _nearest_keyword_distance(text_lower: str, start: int, keywords: Iterable[str]) -> int:
    nearest = 10_000
    for keyword in keywords:
        cursor = 0
        while True:
            idx = text_lower.find(keyword, cursor)
            if idx == -1:
                break
            nearest = min(nearest, abs(start - idx))
            cursor = idx + 1
    return nearest


def extract_otp_candidates(
    text: str,
    otp_length_min: int = 4,
    otp_length_max: int = 8,
) -> list[str]:
    if otp_length_min < 1 or otp_length_max < otp_length_min:
        return []

    pattern = re.compile(rf"\b\d{{{otp_length_min},{otp_length_max}}}\b")
    lower = text.lower()
    ranked: list[RankedCandidate] = []

    for match in pattern.finditer(text):
        value = match.group(0)
        distance = _nearest_keyword_distance(lower, match.start(), OTP_CONTEXT_KEYWORDS)
        keyword_bonus = max(0, 100 - distance)
        score = keyword_bonus + (5 if len(set(value)) > 1 else 0)
        ranked.append(RankedCandidate(value=value, score=score))

    ranked.sort(key=lambda item: item.score, reverse=True)

    deduped: list[str] = []
    seen: set[str] = set()
    for item in ranked:
        if item.value not in seen:
            seen.add(item.value)
            deduped.append(item.value)
    return deduped


def extract_verification_link_candidates(
    text: str,
    preferred_domains: list[str] | None = None,
) -> list[str]:
    preferred = {domain.lower() for domain in (preferred_domains or [])}
    lower = text.lower()
    ranked: list[RankedCandidate] = []

    for match in URL_PATTERN.finditer(text):
        url = match.group(0).rstrip(",.)")
        parsed = urlparse(url)
        host = (parsed.netloc or "").lower()

        score = 0
        if preferred and host in preferred:
            score += 100
        if any(keyword in url.lower() for keyword in LINK_CONTEXT_KEYWORDS):
            score += 30

        distance = _nearest_keyword_distance(lower, match.start(), LINK_CONTEXT_KEYWORDS)
        score += max(0, 30 - distance)
        if parsed.scheme == "https":
            score += 5

        ranked.append(RankedCandidate(value=url, score=score))

    ranked.sort(key=lambda item: item.score, reverse=True)

    deduped: list[str] = []
    seen: set[str] = set()
    for item in ranked:
        if item.value not in seen:
            seen.add(item.value)
            deduped.append(item.value)
    return deduped
