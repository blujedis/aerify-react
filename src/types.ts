import { DetailedHTMLProps, HTMLAttributes, LiHTMLAttributes, TableHTMLAttributes } from 'react';

export type DivProps = DetailedHTMLProps<
HTMLAttributes<HTMLDivElement>,
HTMLDivElement
>;

export type UlProps = DetailedHTMLProps<
HTMLAttributes<HTMLUListElement>,
HTMLUListElement
>;

export type LiProps = DetailedHTMLProps<
LiHTMLAttributes<HTMLLIElement>,
HTMLLIElement
>;

export type TableProps = DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
