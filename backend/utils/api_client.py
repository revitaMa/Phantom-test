import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


def create_session():
    curr_session = requests.Session()
    retries = Retry(
        total=3,
        backoff_factor=0.3,
        status_forcelist=[504],
        allowed_methods=frozenset({"GET", "POST"}),
    )
    adapter = HTTPAdapter(max_retries=retries)
    curr_session.mount("https://", adapter)
    curr_session.mount("http://", adapter)
    return curr_session


session = create_session()
