"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Edit, FileText, Trash2 } from "lucide-react";
import { API_BASE_URL } from "@/utils/config";
import { usePreferences } from "@/context/PreferencesContext";

export default function ViewExpensesPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const { currency } = usePreferences();

  const downloadBlob = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const escapeCsvValue = (value) => {
    const text = String(value ?? "");
    return `"${text.replaceAll('"', '""')}"`;
  };

  const handleExportCsv = () => {
    const csv = [
      ["Title", "Category", "Amount", "Date", "Description"],
      ...transactions.map((tx) => [
        tx.title,
        tx.category,
        `${currency}${tx.amount}`,
        new Date(tx.date).toLocaleDateString("en-IN"),
        tx.description || "",
      ]),
    ]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");

    downloadBlob(csv, "transactions.csv", "text/csv;charset=utf-8");
  };

  const escapePdfText = (value) =>
    String(value ?? "")
      .replace(/[^\x20-\x7E]/g, "")
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");

  const getPdfCurrency = () => {
    const labels = {
      "₹": "INR",
      "$": "USD",
      "€": "EUR",
      "£": "GBP",
      "¥": "JPY",
    };

    return labels[currency] || currency;
  };

  const buildPdf = () => {
    const pdfCurrency = getPdfCurrency();
    const lines = [
      "Expense Tracker - Transactions Report",
      `Generated: ${new Date().toLocaleString("en-IN")}`,
      "",
      "Title | Category | Amount | Date | Description",
      ...transactions.map((tx) => {
        const date = new Date(tx.date).toLocaleDateString("en-IN");
        return `${tx.title} | ${tx.category} | ${pdfCurrency} ${tx.amount} | ${date} | ${tx.description || "-"}`;
      }),
    ];

    const pages = [];
    for (let index = 0; index < lines.length; index += 32) {
      pages.push(lines.slice(index, index + 32));
    }

    const objects = [];
    const addObject = (content) => {
      objects.push(content);
      return objects.length;
    };

    const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
    const pagesId = addObject("");
    const pageIds = [];
    const fontId = 3 + pages.length * 2;

    pages.forEach((page) => {
      const content = [
        "BT",
        "/F1 10 Tf",
        "50 790 Td",
        "14 TL",
        ...page.map((line) => `(${escapePdfText(line).slice(0, 110)}) Tj T*`),
        "ET",
      ].join("\n");
      const contentId = addObject(
        `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
      );
      const pageId = addObject(
        `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`
      );
      pageIds.push(pageId);
    });

    addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
    objects[pagesId - 1] =
      `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

    let pdf = "%PDF-1.4\n";
    const offsets = [0];

    objects.forEach((object, index) => {
      offsets.push(pdf.length);
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });

    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += "0000000000 65535 f \n";
    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
    });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    return pdf;
  };

  const handleDownloadPdf = () => {
    downloadBlob(buildPdf(), "transactions-report.pdf", "application/pdf");
  };

  // ✅ Fetch all transactions (both expenses and incomes)
  const fetchTransactions = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch expenses");

      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  // ✅ Delete a transaction
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete expense");
      setMessage("✅ Transaction deleted successfully!");
      fetchTransactions(); // refresh list
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#e0f2fe] via-[#ecfdf5] to-[#e8f5e9] p-4 sm:p-8 relative">
      
      {/* ✅ Back Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="self-start sm:absolute sm:top-6 sm:left-6 flex items-center gap-2 text-sm sm:text-base text-green-700 hover:text-emerald-700 font-semibold bg-white/70 px-3 sm:px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all backdrop-blur-md border border-green-200"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl sm:rounded-3xl w-full max-w-5xl p-4 sm:p-8 border border-green-200 mt-6 sm:mt-20">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8 text-gray-800">
          📊 All Transactions
        </h2>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={transactions.length === 0}
            className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-white/80 px-4 py-2 text-sm font-semibold text-green-700 shadow-sm transition-all hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileText size={16} /> Export CSV
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={transactions.length === 0}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:from-green-600 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>

        {message && (
          <p
            className={`text-center mb-4 font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-[760px] w-full border-collapse text-sm text-gray-700">
              <thead>
                <tr className="bg-green-100 text-green-800">
                  <th className="px-4 py-3 text-left rounded-tl-xl">Title</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Amount ({currency})</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-center rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-green-50 border-b border-gray-100 transition-all"
                  >
                    <td className="px-4 py-3 font-medium">{tx.title}</td>
                    <td className="px-4 py-3">{tx.category}</td>
                    <td
                      className={`px-4 py-3 font-semibold ${
                        tx.amount >= 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {currency}{tx.amount}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(tx.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tx.description || "-"}
                    </td>
                    <td className="px-4 py-3 text-center flex justify-center gap-3">
                      <button
                        onClick={() => router.push(`/expenses/edit/${tx._id}`)}
                        className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full shadow-sm transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(tx._id)}
                        className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full shadow-sm transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
