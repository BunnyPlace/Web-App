import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAppStore } from "@/services/store/store";
import { redirectToScreenFromCode } from "@/utils/redirectToScreenFromCode";

export default function Quests() {
  const router = useRouter();
  const setScreen = useAppStore(state => state.setScreen);

  useEffect(() => {
    const code = router.asPath.replace("/", "");
    redirectToScreenFromCode(code, setScreen, router);
    router.push("/");
  }, [router, setScreen, router.asPath, router.push]);

  return null;
}
