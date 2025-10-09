// pages/index.tsx
import { GetServerSideProps } from "next";
import { spooler } from "@/lib/spooler";
import { logger } from "@/lib/logger";

type Props = {
  data: any;
};

export default function Home({ data }: Props) {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Schema Data (Direct from Server)</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  logger.info("Fetch starting...");

  try {
    const data = await spooler.fetch();

    logger.info("Fetch success", {
      sample: JSON.stringify(data).slice(0, 200),
    });

    return { props: { data } };
  } catch (err: any) {
    logger.error("Fetch failed", {
      message: err?.message || "Unknown error",
      stack: err?.stack || "",
    });

    return { props: { data: null } };
  }
};