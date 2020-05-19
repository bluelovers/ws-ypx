import createTemporaryDirectory, { getCacheDir } from '../lib/createTemporaryDirectory';
import { dirname, normalize } from 'path';

test(`tmp`, async () =>
{
	const tmpdir = getCacheDir();

	let actual = await createTemporaryDirectory();

	expect(dirname(actual)).toStrictEqual(normalize(tmpdir));

});


