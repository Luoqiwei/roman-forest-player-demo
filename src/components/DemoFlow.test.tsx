import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

vi.mock('html-to-image', () => ({ toPng: vi.fn().mockResolvedValue('data:image/png;base64,AA==') }));

describe('播放器 Demo 闭环', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  });

  it('播放按钮可以切换状态', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '播放' }));
    expect(screen.getByRole('button', { name: '暂停' })).toBeInTheDocument();
  });

  it('播放页1无森林入口，播放页2平躺后树生长在唱片上', async () => {
    render(<App />);
    expect(screen.queryByRole('button', { name: '进入罗曼森林' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '3D专辑旋转样式' }));
    const album = screen.getByTestId('rotating-album-cover');

    fireEvent.mouseDown(album, { clientY: 200 });
    fireEvent.mouseMove(album, { clientY: 300 });
    fireEvent.mouseUp(album);
    expect(screen.queryByRole('img', { name: '专辑上的初遇之芽' })).not.toBeInTheDocument();

    fireEvent.mouseDown(album, { clientY: 200 });
    fireEvent.mouseMove(album, { clientY: 100 });
    fireEvent.mouseUp(album);

    const startDialog = await screen.findByRole('dialog', { name: '开启自习确认' });
    expect(startDialog).toHaveTextContent('音乐播放时将累计专注时间');
    expect(screen.queryByRole('img', { name: '专辑上的初遇之芽' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '开启自习' }));

    const tree = await screen.findByRole('img', { name: '专辑上的糖果初芽' });
    expect(screen.getByRole('region', { name: '音乐树成长进度' })).toHaveTextContent('距离下一阶段还需');
    const treeImage = tree.querySelector('img');
    expect(treeImage).toHaveAttribute('src', '/assets/trees/candy-clay/stage-1.webp');
    expect(treeImage?.className).toContain('smoothTreePlaying');
    expect(screen.getByRole('button', { name: '暂停' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '暂停' }));
    expect(treeImage).toHaveAttribute('src', '/assets/trees/candy-clay/stage-1.webp');
    expect(treeImage?.className).not.toContain('smoothTreePlaying');
    fireEvent.click(screen.getByRole('button', { name: '播放' }));
    expect(treeImage?.className).toContain('smoothTreePlaying');

    fireEvent.click(screen.getByRole('button', { name: '打开 Demo 控制台' }));
    fireEvent.click(screen.getByRole('button', { name: '原像素树' }));
    const pixelTree = await screen.findByRole('img', { name: '专辑上的初遇之芽' });
    expect(pixelTree.querySelector('img')?.getAttribute('src')).toMatch(
      /\/assets\/trees\/sway\/stage-1\/frame-\d{2}\.webp/,
    );
    fireEvent.click(screen.getByRole('button', { name: '关闭' }));

    fireEvent.click(screen.getByRole('button', { name: '标准播放样式' }));
    fireEvent.click(screen.getByRole('button', { name: '3D专辑旋转样式' }));
    expect(screen.getByRole('img', { name: '专辑上的初遇之芽' })).toBeInTheDocument();
  });

  it('取消开启自习后不展示树木且不播放', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '3D专辑旋转样式' }));
    const album = screen.getByTestId('rotating-album-cover');
    fireEvent.mouseDown(album, { clientY: 200 });
    fireEvent.mouseMove(album, { clientY: 100 });
    fireEvent.mouseUp(album);

    await screen.findByRole('dialog', { name: '开启自习确认' });
    fireEvent.click(screen.getByRole('button', { name: '暂不开启' }));

    expect(screen.queryByRole('dialog', { name: '开启自习确认' })).not.toBeInTheDocument();
    expect(screen.queryByRole('img', { name: '专辑上的初遇之芽' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '播放' })).toBeInTheDocument();
  });

  it('分享成功后首次固定获得福塔', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '打开分享' }));
    expect(screen.getByRole('dialog', { name: '分享我的森林' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '模拟分享成功' }));
    expect(screen.getByRole('dialog', { name: '获得森林居民' })).toHaveTextContent('福塔');
  });

  it('分享卡包含歌曲、阶段和陪伴文案', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '打开分享' }));
    const dialog = screen.getByRole('dialog', { name: '分享我的森林' });
    expect(dialog).toHaveTextContent('尽情一刻');
    expect(dialog).toHaveTextContent('糖果初芽');
    expect(dialog).toHaveTextContent('陪伴时长');
    expect(dialog).toHaveTextContent('00:00');
  });

  it('重置后音频、播放状态和进度归零', () => {
    render(<App />);
    const audio = document.querySelector('audio');
    expect(audio).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: '播放' }));
    if (audio) {
      audio.currentTime = 42;
      fireEvent.timeUpdate(audio);
    }
    fireEvent.keyDown(window, { key: 'D', shiftKey: true });
    fireEvent.click(screen.getByRole('button', { name: '重置' }));

    expect(audio?.paused).toBe(true);
    expect(audio?.currentTime).toBe(0);
    expect(screen.getByRole('button', { name: '播放' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: '播放进度' })).toHaveValue('0');
  });
});
