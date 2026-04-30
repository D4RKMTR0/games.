import { motion } from "framer-motion"

function LogIn() {
    return (
        <motion.main
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            exit={{ clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
        >
            
        </motion.main>
    )
}

export default LogIn