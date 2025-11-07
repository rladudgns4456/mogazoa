import CompareTable from "@/components/table/CompareTable";

export default function TableTestPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <CompareTable
        debugBorder
        top={{ a: "0.0", b: "0.0" }}
        rows={[
          { a: "0개", b: "0개" },
          { a: "0개", b: "0개", highlight: "b" },
        ]}
        side={{
          pill1: "4.9",
          pill2: "300개",
          trophyText: "100개",
        }}
      />
    </main>
  );
}
