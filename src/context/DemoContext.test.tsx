import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DemoProvider, useDemo } from './DemoContext';
import { StageUpgradeModal } from '../components/StageUpgradeModal';

function Harness() {
  const demo = useDemo();
  return (
    <>
      <button onClick={() => demo.setPlaying(!demo.isPlaying)}>切换播放</button>
      <button onClick={() => demo.setStage(2)}>升级二阶段</button>
      <button onClick={() => demo.startStudying()}>开始自习</button>
      <span data-testid="seconds">{Math.floor(demo.playedSeconds)}</span>
      {demo.upgradeStage && <StageUpgradeModal />}
    </>
  );
}

describe('DemoContext 交互', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
  });

  it('自习中仅在播放且页面可见时增长', () => {
    render(<DemoProvider><Harness /></DemoProvider>);
    fireEvent.click(screen.getByText('开始自习'));
    act(() => vi.advanceTimersByTime(2100));
    expect(screen.getByTestId('seconds')).toHaveTextContent('0');

    fireEvent.click(screen.getByText('切换播放'));
    act(() => vi.advanceTimersByTime(2100));
    expect(Number(screen.getByTestId('seconds').textContent)).toBeGreaterThanOrEqual(1);

    fireEvent.click(screen.getByText('切换播放'));
    const pausedAt = screen.getByTestId('seconds').textContent;
    act(() => vi.advanceTimersByTime(2100));
    expect(screen.getByTestId('seconds')).toHaveTextContent(pausedAt ?? '');

    fireEvent.click(screen.getByText('切换播放'));
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    const before = screen.getByTestId('seconds').textContent;
    act(() => vi.advanceTimersByTime(2100));
    expect(screen.getByTestId('seconds')).toHaveTextContent(before ?? '');
  });

  it('升级弹窗 2.2 秒后自动关闭', () => {
    render(<DemoProvider><Harness /></DemoProvider>);
    fireEvent.click(screen.getByText('升级二阶段'));
    expect(screen.getByText('点击任意位置跳过')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(2200));
    expect(screen.queryByText('点击任意位置跳过')).not.toBeInTheDocument();
  });

  it('升级弹窗支持点击跳过', () => {
    render(<DemoProvider><Harness /></DemoProvider>);
    fireEvent.click(screen.getByText('升级二阶段'));
    fireEvent.click(screen.getByRole('button', { name: /成长到第 2 阶段/ }));
    expect(screen.queryByText('点击任意位置跳过')).not.toBeInTheDocument();
  });
});
