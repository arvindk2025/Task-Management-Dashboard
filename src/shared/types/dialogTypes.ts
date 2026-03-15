export interface IConfirmationDialogProps {
	title: string | React.ReactNode;
	modalOpen: boolean;
	modalContent: string | React.ReactNode;
	handleYes: () => void;
	handleNo: () => void;
	handleModalClose?: () => void;
}
