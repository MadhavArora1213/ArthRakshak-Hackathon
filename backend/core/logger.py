import sys
import re
from typing import Any, Dict

from loguru import logger

from core.config import settings

EMAIL = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")


def _mask(record: Dict[str, Any]) -> Dict[str, Any]:
    record["message"] = EMAIL.sub("[redacted]", record["message"])
    return record


logger.remove()
logger.add(
    sys.stdout,
    level=settings.log_level.upper(),
    serialize=False,
    filter=_mask,
    backtrace=False,
)

log = logger
