"""Fetch the Bank of Israel interest rate and write data/interest-rates.json.

The prime rate is derived by the standard Israeli convention:
prime = Bank of Israel rate + 1.5 percentage points.
"""

import csv
import io
import json
import sys
import urllib.request

BANK_OF_ISRAEL_URL = (
    "https://edge.boi.gov.il/FusionEdgeServer/sdmx/v2/data/dataflow/"
    "BOI.STATISTICS/BR/1.0/?c%5BDATA_TYPE%5D=OF&format=csv&lastNObservations=1"
)
BANK_OF_ISRAEL_SERIES = "RIB_BOI"
PRIME_MARGIN = 1.5
OUTPUT_PATH = "data/interest-rates.json"


def fetch_bank_rate():
    """Return (rate, date) of the latest Bank of Israel interest rate."""
    request = urllib.request.Request(BANK_OF_ISRAEL_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        csv_text = response.read().decode("utf-8")
    for row in csv.DictReader(io.StringIO(csv_text)):
        if row["IR_FV_TYPE"] == BANK_OF_ISRAEL_SERIES:
            return float(row["OBS_VALUE"]), row["TIME_PERIOD"]
    raise ValueError("Bank of Israel series " + BANK_OF_ISRAEL_SERIES + " not found")


def main():
    bank_rate, rate_date = fetch_bank_rate()
    if not 0 <= bank_rate <= 20:
        sys.exit("Unreasonable rate received: " + str(bank_rate))
    interest_rates = {
        "boiRate": round(bank_rate, 2),
        "primeRate": round(bank_rate + PRIME_MARGIN, 2),
        "updatedDate": rate_date,
        "source": "Bank of Israel",
    }
    with open(OUTPUT_PATH, "w", encoding="utf-8") as output_file:
        json.dump(interest_rates, output_file, indent=2)
        output_file.write("\n")
    print(interest_rates)


if __name__ == "__main__":
    main()
