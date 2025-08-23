import { PropsWithChildren } from 'react'

export const Container: React.FC<PropsWithChildren> = ({ children }) => {
	return <div className="p-2.5">{children}</div>
}
