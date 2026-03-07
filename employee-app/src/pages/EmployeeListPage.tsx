import "./employee-list.css";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import Button from "../components/Button/button";
import { getBasicInfoList } from "../services/basicInfoService";
import { getDetailsByEmployeeIds } from "../services/detailsService";
import type { BasicInfoRecord } from "../services/basicInfoService";
import type { DetailsRecord } from "../services/detailsService";

interface MergedEmployee extends BasicInfoRecord {
  employmentType?: string;
  officeLocation?: string;
}

const LIMIT_OPTIONS = [5, 10, 20];
const PLACEHOLDER = "—";

function cell(value: string | undefined | null) {
  if (!value || value.trim() === "") return null;
  return value;
}

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const { role } = useRole();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [employees, setEmployees] = useState<MergedEmployee[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: basicList, total: t } = await getBasicInfoList(page, limit);
      setTotal(t);

      const ids = basicList.map((e) => e.employeeId);
      let detailsMap: Record<string, DetailsRecord> = {};
      if (ids.length > 0) {
        const detailsList = await getDetailsByEmployeeIds(ids);
        detailsMap = Object.fromEntries(
          detailsList.map((d) => [d.employeeId, d]),
        );
      }

      const merged: MergedEmployee[] = basicList.map((b) => {
        const d = detailsMap[b.employeeId];
        return {
          ...b,
          employmentType: d?.employmentType,
          officeLocation: d?.officeLocation,
        };
      });

      setEmployees(merged);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load employees.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="employee-list">
      <h1 className="employee-list__title">Employee List</h1>

      {error && <p className="employee-list__error">{error}</p>}

      <div className="employee-list__toolbar">
        <div className="employee-list__toolbar-left">
          <label className="employee-list__toolbar-label" htmlFor="per-page">
            Rows per page
          </label>
          <select
            id="per-page"
            className="employee-list__per-page"
            value={limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
          >
            {LIMIT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {role === "Admin" && (
          <Button size="sm" onClick={() => navigate("/wizard")}>
            + Add Employee
          </Button>
        )}
      </div>

      <div className="employee-list__table-wrap">
        <table className="employee-list__table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Employment Type</th>
              <th>Office Location</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="employee-list__state">
                  Loading…
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="employee-list__state">
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.employeeId}</td>
                  <td>{emp.fullName}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>
                    <span className="employee-list__badge">{emp.role}</span>
                  </td>
                  <td
                    className={
                      !cell(emp.employmentType)
                        ? "employee-list__cell--placeholder"
                        : undefined
                    }
                  >
                    {cell(emp.employmentType) ?? PLACEHOLDER}
                  </td>
                  <td
                    className={
                      !cell(emp.officeLocation)
                        ? "employee-list__cell--placeholder"
                        : undefined
                    }
                  >
                    {cell(emp.officeLocation) ?? PLACEHOLDER}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="employee-list__pagination">
        <span className="employee-list__page-info">
          Page {page} of {totalPages} &nbsp;·&nbsp; {total} record
          {total !== 1 ? "s" : ""}
        </span>
        <Button
          size="sm"
          variant="secondary"
          disabled={page <= 1 || isLoading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={page >= totalPages || isLoading}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
