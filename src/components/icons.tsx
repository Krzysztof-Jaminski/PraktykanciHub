
export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        width="40"
        height="40"
        viewBox="0 0 28 24"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g opacity="0.7">
            <path d="M6 3v18" />
            <path d="M18 3v18" />
            <path d="M6 12h12" />
        </g>
        <g>
            <path d="M10 3v18" />
            <path d="M22 3v18" />
            <path d="M10 12h12" />
        </g>
    </svg>
);
