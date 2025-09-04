const styles = {
  overlay:
    "fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-white to-purple-200",
  spinner:
    "h-16 w-16 border-4 border-transparent border-t-pink-500 border-r-purple-500 rounded-full animate-spin",
  text: "mt-6 text-xl font-semibold text-gray-700 tracking-wide animate-pulse",
};

const Loading = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
      <p className={styles.text}>잠시만 기다려주세요...</p>
    </div>
  );
};

export default Loading;
