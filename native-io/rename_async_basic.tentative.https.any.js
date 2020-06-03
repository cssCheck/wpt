// META: title=NativeIO API: File renaming is reflected in listing.
// META: global=window,worker

'use strict';

promise_test(async testCase => {
  const file = await nativeIO.open('test_file');
  testCase.add_cleanup(async () => {
    await nativeIO.delete('test_file');
    await nativeIO.delete('new_name');
  });
  await file.close();

  const fileNamesBeforeRename = await nativeIO.getAll();
  assert_in_array('test_file', fileNamesBeforeRename);

  await nativeIO.rename('test_file', 'new_name');
  const fileNamesAfterRename = await nativeIO.getAll();
  assert_equals(fileNamesAfterRename.indexOf('test_file'), -1);
  assert_in_array('new_name', fileNamesAfterRename);
}, 'nativeIO.getAll does not returns a file renamed by nativeIOFile.rename with its new name');

promise_test(async testCase => {
  const file = await nativeIO.open('test_file');
  const file2 = await nativeIO.open('test_file_2');
  testCase.add_cleanup(async () => {
    await file.close();
    await file2.close();
    await nativeIO.delete('test_file');
    await nativeIO.delete('test_file_2');
  });
  await file.close();
  await file2.close();

  promise_rejects_dom(testCase, "UnknownError", nativeIO.rename('test_file', 'test_file_2'));

  const fileNamesAfterRename = await nativeIO.getAll();
  assert_in_array('test_file', fileNamesAfterRename);
  assert_in_array('test_file_2', fileNamesAfterRename);
}, 'nativeIOFile.rename overwrites an existing file.');

promise_test(async testCase => {
  const file = await nativeIO.open('test_file');
  testCase.add_cleanup(async () => {
    await file.close();
    await nativeIO.delete('test_file');
  });
  promise_rejects_dom(testCase, "UnknownError", nativeIO.rename('test_file', 'new_name'));
  await file.close();

  const fileNamesAfterRename = await nativeIO.getAll();
  assert_equals(fileNamesAfterRename.indexOf('new_name'), -1);
  assert_in_array('test_file', fileNamesAfterRename);
}, 'nativeIOFile.rename allows renaming an open file.');
