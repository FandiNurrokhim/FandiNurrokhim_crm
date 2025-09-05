import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "@/Layouts/Table";
import Card from "@/Components/Atoms/Card";

const ReportTable = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [month, setMonth] = useState("");
    const [isFiltered, setIsFiltered] = useState(false);

    const handleSearch = (query) => {
        setSearch(query);
        if (query !== search) {
            setCurrentPage(1);
        }
    };

    const fetchData = () => {
        setIsLoading(true);
        axios
            .get("/admin/report/data", {
                params: {
                    page: currentPage,
                    search: search,
                    month: month,
                },
            })
            .then((response) => {
                setData(response.data.data);
                setTotalPages(response.data.last_page);
                setIsLoading(false);
                setIsFiltered(!!month || !!search);
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    const handleReset = () => {
        setMonth("");
        setSearch("");
        setCurrentPage(1);
        setIsFiltered(false);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, search, month]);

    const handleExport = () => {
        window.location.href = `/admin/report/export?month=${month}&search=${search}`;
    };

    const columns = [
        { header: "Tanggal", accessor: (row) => row.date || "-" },
        { header: "Nama Customer", accessor: (row) => row.customer_name || "-" },
        { header: "Produk", accessor: (row) => row.product_name || "-" },
        { header: "Total", accessor: (row) => row.total ? `Rp${parseInt(row.total).toLocaleString("id-ID")}` : "-" },
    ];

    return (
        <Card>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium">Filter Bulan</label>
                    <input
                        type="month"
                        value={month}
                        onChange={e => setMonth(e.target.value)}
                        className="border rounded px-2 py-1"
                    />
                </div>
                <button
                    onClick={fetchData}
                    className="bg-blue-600 text-white px-4 py-2 rounded self-end"
                >
                    Filter
                </button>
                {isFiltered && (
                    <button
                        onClick={handleReset}
                        className="bg-gray-400 text-white px-4 py-2 rounded self-end"
                    >
                        Reset Filter
                    </button>
                )}
                <button
                    onClick={handleExport}
                    className="bg-green-600 text-white px-4 py-2 rounded self-end"
                >
                    Download Excel
                </button>
            </div>
            <Table
                columns={columns}
                data={data}
                currentPage={currentPage}
                totalPages={totalPages}
                onSearch={handleSearch}
                onPageChange={(page) => setCurrentPage(page)}
                isProcessing={isLoading}
            />
        </Card>
    );
};

export default ReportTable;