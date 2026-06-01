import { History, ShieldAlert } from "lucide-react";
import { formatDate } from "../lib/dates";
import { formatPenalty, getRentalSummary } from "../lib/rentalRules";
import type { RentalRecord } from "../types";

interface RentalHistoryProps {
  records: RentalRecord[];
}

export function RentalHistory({ records }: RentalHistoryProps) {
  const recentRecords = records.slice(0, 5);

  return (
    <section className="history-panel" aria-label="Historia wypożyczeń">
      <div className="panel-heading">
        <History size={22} />
        <div>
          <h2>Historia</h2>
          <p>Ostatnie wypożyczenia</p>
        </div>
      </div>

      {recentRecords.length === 0 ? (
        <p className="empty-copy">Historia pojawi się po pierwszym wypożyczeniu.</p>
      ) : (
        <div className="history-list">
          {recentRecords.map((record) => {
            const liveSummary = getRentalSummary(record.dueDate);
            const penalty = record.penaltyAtReturn ?? liveSummary.penalty;

            return (
              <article key={record.id} className="history-item">
                <div>
                  <h3>{record.gameTitle}</h3>
                  <p>
                    {formatDate(record.borrowedAt)} -{" "}
                    {record.returnedAt ? formatDate(record.returnedAt) : "aktywne"}
                  </p>
                </div>

                {penalty > 0 ? (
                  <span className="history-penalty">
                    <ShieldAlert size={15} />
                    {formatPenalty(penalty)}
                  </span>
                ) : (
                  <span className={record.returnedAt ? "history-status" : "history-status active"}>
                    {record.returnedAt ? "Oddana" : "W toku"}
                  </span>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
