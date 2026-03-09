import createTemporaryDirectory, { _getCacheDir } from '../lib/createTemporaryDirectory';
import { dirname, normalize } from 'upath2';

test(`tmp`, async () =>
{
	const tmpdir = _getCacheDir();

	let actual = await createTemporaryDirectory();

	expect(dirname(actual)).toStrictEqual(normalize(tmpdir));

});


