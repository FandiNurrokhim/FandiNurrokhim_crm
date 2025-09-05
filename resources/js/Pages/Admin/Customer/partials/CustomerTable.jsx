import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "@/Layouts/Table";
import Card from "@/Components/Atoms/Card";

const CustomerTable = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");

    const handleSearch = (query) => {
        setSearch(query);
        if (query !== search) {
            setCurrentPage(1);
        }
    };

    const fetchData = () => {
        setIsLoading(true);
        axios
            .get("/admin/customer/data", {
                params: {
                    page: currentPage,
                    search: search,
                },
            })
            .then((response) => {
                setData(response.data.data);
                setTotalPages(response.data.last_page);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, search]);

    const columns = [
        {
            header: "Nama Customer",
            accessor: (row) => row.name || "-",
        },
        {
            header: "Kontak",
            accessor: (row) => row.contact || "-",
        },
        {
            header: "Alamat",
            accessor: (row) => row.address || "-",
        },
        {
            header: "Layanan Berlangganan",
            accessor: (row) =>
                row.services && row.services.length > 0
                    ? (
                        <ul className="list-disc pl-4">
                            {row.services.map((service, idx) => (
                                <li key={idx}>
                                    {service.product?.name || "-"}{" "}
                                    {service.is_active
                                        ? <span className="text-green-600">(Aktif)</span>
                                        : <span className="text-gray-400">(Tidak Aktif)</span>
                                    }
                                </li>
                            ))}
                        </ul>
                    )
                    : <span className="text-gray-400">Belum ada layanan</span>,
        },
    ];

    return (
        <Card>
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

export default CustomerTable;